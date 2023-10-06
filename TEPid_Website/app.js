//Server side code.
//To build a local version of the website on docker, run ./docker_build.sh then ./run_docker.sh 
//Open localhost:8080.
//To test without docker, run `node app.js`. Then open localhost:3000.

//To kill a docker image:
//docker ps (lists containers)
//docker kill <containerID>
//docker system prune -a
//Then you can build it again: run ./docker_build.sh then ./run_docker.sh 

//Neccessary imports
const express = require('express')
const bodyParser = require('body-parser')
const {spawn} = require('child_process');
const app = express()
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');
const { v4: uuidv4 } = require('uuid');

//Allow the frontend to access /public and /uploads when fetching data.
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/uploads', express.static(process.cwd() + '/uploads'));

app.use(bodyParser.urlencoded({extended: false}));


//Retrieve smileString from jQuery POST in public/script.js.
app.post('/upload', (req, res) => {
    //console.log("uploading...");

    //If there is no smileString, an error can be generated.
    //This should never be called since we check for this in public/script.js first.
    if (!req.body.smileString) {
        //console.log("error!");
        res.status(404).json({ error: 'Please provide an string' });
        return;
    }

    //Remove all previous uploaded files from uploads.
    const directory = "uploads";
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(directory, file), (err) => {
                if (err) throw err;
            });
        }   
    });

    //Set a random ID for our generated image.
    let imageID =  uuidv4();
    

    const smileString = req.body.smileString; //Returned in JSON from POST request

    //Spawn new child process to call the python script (parameterExtractor.py)
    const python = spawn('python3', ['parameterExtractor.py',smileString, imageID]);
    //console.log("python spawned...")
    
    let dataToSend;
    
    //Collect data from python script and send it back to the front end.
    python.stdout.on('data', function (data) {
        //console.log('Pipe data from python script ...');
        
        //Convert the output of parameterExtractor.py to a string. 
        dataToSend = data.toString().trim();

        //If Python returns an error, send a 404 res to the front end.
        if (dataToSend == "ERROR"){
            //console.log("invalid SMILE string...");
            res.status(404).json({ error: 'Invalid SMILE string' });
            return;
        }
        //If Python returns a successful Tolman Parameter Prediction,
        //send the predicted Tolman's Parameter and the generated imageID.
        res.status(200).send({output: dataToSend, imageID : imageID});
        //console.log(dataToSend);
        return;
    });

});

//Retrieve CSV from jQuery POST in public/script.js. 
app.post('/uploadCSV', upload.single('smileStringCSV'), (req, res) => {
    //console.log("uploading csv...");

    //If there is no CSV file, an error can be generated.
    //This should never be called since we check for this in public/script.js first.
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).end();
    }

    //Create a new file in our uploads directory to be modified and accessed by the frontEnd.
    const newPath =path.join("uploads", "generatedCSVFile.csv"); 
    fs.rename(req.file.path, newPath, err => {
        if (err) {
          console.error(err);
          return res.status(500).end();
        }
    });

    //Spawn new child process to call the python script (csvExtractor.py)
    const python = spawn('python3', ['csvExtractor.py',newPath]);

    //Collect data from python script and modify the CSV in csvExtractor.py to send to the front end.
    python.stdout.on('data', function (data) {
        dataToSend = data.toString();
        if (dataToSend == "ERROR"){
            res.status(404).json({ error: 'Invalid CSV file' });
            return;
        }
        res.status(200).send({path: newPath});
        //console.log(dataToSend);
        return;
    });

});

//Send our index.html file when we load the website.
app.get("/", function (req, res) {
    //console.log("in /")
    res.sendFile(process.cwd() + "/index.html");
});

//3000 is our default port. This is masked as 8080 when we run app.js in docker.
const port = 3000;
const host = "0.0.0.0";
app.listen(port, host, () => console.log(`Tolman Electronic Parameter Predictor listening on port 
${port}! (If running in docker, use port 8080)`));