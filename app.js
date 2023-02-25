const express = require('express')
const bodyParser = require('body-parser')
const {spawn} = require('child_process');
const app = express()

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.post('/upload', (req, res) => {
    console.log("uploading...");
    if (!req.body.smileString) {
        console.log("error!");
        res.status(404).json({ error: 'Please provide an string' });
        return;
    }

    
    const smileString = req.body.smileString;
    let dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python3', ['parameterExtractor.py',smileString]);
    // collect data from script
    console.log("python spawned...")
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        if (dataToSend == "ERROR"){
            res.status(404).json({ error: 'Invalid SMILE string' });
            return;
        }
        res.status(200).send({output: dataToSend });
        console.log(dataToSend);
        return;
    });



    // in close event we are sure that stream from child process is closed
    // python.on('close', (code) => {
    //     console.log(`child process close all stdio with code ${code}`);
    //     res.status(200).json({output: dataToSend });

    //     console.log("sent ", dataToSend);
    // });
    
});

app.get("/", function (req, res) {
    console.log("in /")
    res.sendFile(process.cwd() + "/index.html");
});



const port = 3000
const host = "0.0.0.0"
app.listen(port, host, () => console.log(`Example app listening on port 
${port}!`))