# Speech Recognition with Vue.js and OpenAI API
This repository contains code for a simple web app that uses Vue.js and the OpenAI API to provide speech recognition and text-to-speech conversion.
It allows almost a conversational approach to using open AIs Chat GPT

## Getting Started
To run the application, clone the repository and navigate to the directory containing the code. 
Then, install the dependencies using npm:

```
npm install
```

Finally, start the application using the following command:

```
npm run dev
```

The app will be hosted on (http://127.0.0.1:5174/)

Then start the backend by navigating to the backend folder and running:

```
npm run watch
```

which will start the node server on (http://localhost:4001)

## How it Works
The application consists of two main components: a Vue.js frontend and a Node.js backend. The frontend provides a simple interface for users to ask questions using speech recognition, and the backend handles the text-to-speech conversion using the OpenAI API and AWS.

## Frontend
The frontend is built using Vue.js and the vue-audio-visual and axios libraries. 
The vue-audio-visual library is used to display an audio visualizer while the user is speaking, and axios is used to send the user's question to the backend.

When the user clicks the "Ask question" button, the runSpeechRecognition function is called. 
This function starts the speech recognition process using the browser's SpeechRecognition API. 
When the user finishes speaking, the recognized text is sent to the backend using a POST request. 
The backend then converts the text to speech and returns the audio file path to the frontend. 
The audio file is played using an HTML audio element.

## Backend
The backend is built using Node.js and the express, cors, body-parser, openai, and aws-sdk libraries. 
When the backend receives a POST request containing the user's question, it sends a text completion request to the OpenAI API using the openai library. 
The API returns the completed text, which is then converted to speech using AWS Polly. 
The resulting audio file is saved to disk and the file path is returned to the frontend.

## API Keys
To use this project, you'll need to have Tokens for both the OpenAI API and Amazon Polly. To get started, populate the OpenAI token on Line 10 of the index.js file (backend). Additionally, there is a JSON file named awsCreds.json where you can provide your Access Key and Secret Access Key.

#### Open AI Home Page: https://www.openai.com
#### Open AI Api Key Page: https://platform.openai.com/account/api-keys


## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
