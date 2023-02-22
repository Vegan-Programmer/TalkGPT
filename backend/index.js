// Import required libraries and modules
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

// Initialize OpenAI API and AWS SDK with the necessary configurations
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({ apiKey: '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'});
const openai = new OpenAIApi(configuration);
const AWS = require("aws-sdk");
AWS.config.loadFromPath("awsCreds.json");

// Register middleware for parsing request data and enabling CORS for API responses.
app.use(bodyParser.json());
app.use(cors());

// Define an HTTP POST endpoint for the API.
app.post('/api/text-to-audio-file', async (req, res) => {

    // Send a text completion request to the OpenAI API using the specified model and text parameters.
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.body.text,
        max_tokens: 100,
        temperature: 0.5
    })

    // Generate a random number that will be used as the file name.
    let num = (Math.random() * 100000000).toFixed(0);

    // Initialize the Amazon Polly SDK with the specified region and create a new speech synthesis request with the specified text, output format, and voice.
    const polly = new AWS.Polly({ region: "eu-west-2" })
    const params = {
        OutputFormat: "mp3",
        Text: completion.data.choices[0].text,
        VoiceId: "Matthew"
    }

    // Send a speech synthesis request to the Amazon Polly API and save the resulting audio stream to a file.
    polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        let filePath = "../public/voice/";
        let fileName = num + ".mp3";

        // Write the audio stream to a file with the generated file name.
        if (num) fs.writeFileSync(filePath + fileName, data.AudioStream)
    })

    // Send the generated file name back in the response after a delay of 4.5 seconds.
    setTimeout(() => { res.status(200).json(num) }, 4500)
})

// Start the server and log a message to indicate that it's ready.
app.listen(4001, () => { 
    console.log(`Server is ready at http://localhost:4001`); 
});
