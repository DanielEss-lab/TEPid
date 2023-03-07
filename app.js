const express = require('express')
const bodyParser = require('body-parser')
const {spawn} = require('child_process');
const app = express()
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


app.use('/public', express.static(process.cwd() + '/public'));
app.use('/uploads', express.static(process.cwd() + '/uploads'));

app.use(bodyParser.urlencoded({extended: false}));

app.post('/upload', (req, res) => {
    console.log("uploading...");
    if (!req.body.smileString) {
        console.log("error!");
        res.status(404).json({ error: 'Please provide an string' });
        return;
    }


    const directory = "uploads";
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(directory, file), (err) => {
                if (err) throw err;
            });
        }   
    });

    let imageID =  uuidv4();

    const smileString = req.body.smileString;
    let dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python3', ['parameterExtractor.py',smileString, imageID]);
    // collect data from script
    console.log("python spawned...")
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString().trim();
        console.log(dataToSend)
        console.log(dataToSend=="ERROR");
        if (dataToSend == "ERROR"){
            console.log("invalid SMILE string...");
            res.status(404).json({ error: 'Invalid SMILE string' });
            return;
        }
        res.status(200).send({output: dataToSend, imageID : imageID});
        console.log(dataToSend);
        return;
    });

});


app.post('/uploadCSV', (req, res) => {
    console.log("uploading csv...");

    const form = formidable({ multiples: true });
    form.parse(req).on('file', function (name, file) {
        console.log('Got file:', name);
        const uploadsDir = "/uploads";
        const newPath =path.join(uploadsDir, file.name); 
        fs.rename(file.path, newPath);

        const python = spawn('python3', ['csvExtractor.py',newPath]);

        python.stdout.on('data', function (data) {
            dataToSend = data.toString();

            if (dataToSend == "ERROR"){
                res.status(404).json({ error: 'Invalid SMILE string' });
                return;
            }
            res.status(200).send({output: dataToSend });
            console.log(dataToSend);
            return;
        });
        // fs.createReadStream(newPath).on('error', () => {
        //     res.status(404).json({ error: 'Invalid CSV file' });
        //     return;
        // })
        // .pipe(csv())
        // .on('data', (row) => {
        //     console.log(row);
        // })
    
        // .on('end', () => {
        //     // handle end of CSV
        // })
    });

    const csvFile = req.body.csvFile;
    res.status(200).send({output: "Wasssupp" });

})


app.get("/", function (req, res) {
    console.log("in /")
    res.sendFile(process.cwd() + "/index.html");
});

// fs.createReadStream("./migration_data.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2 }))
//   .on("data", function (row) {
//     console.log(row);
//   })

const port = 3000
const host = "0.0.0.0"
app.listen(port, host, () => console.log(`Example app listening on port 
${port}!`))