<!-- Importing the required Vue, Vue-Audio-Visual, and Axios libraries -->
<script setup>
import { ref } from 'vue'
import { useAVLine } from 'vue-audio-visual'
import axios from 'axios'

// Setting up the Vue refs
const player = ref(null)
const canvas = ref(null)
let mySource = ref(null)

// Initializing the action and output refs
let action = ref('')
let output = ref('')

// Setting up the audio visualizer with the player and canvas
useAVLine(player, canvas, { src: mySource, canvHeight: 300, canvWidth: 1000, barColor: 'lime' })

// Function to run speech recognition and send the question to the server
const runSpeechRecognition = () => {

    // Checking if the user's browser supports the SpeechRecognition API
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    
    // Setting up the onstart event
    recognition.onstart = () => { action.value = "listening, please ask your question..." };
    
    // Setting up the onspeechend event
    recognition.onspeechend = () => {
        action.value = "stopped listening...";
        recognition.stop();
    }
  
    // Setting up the onresult event, which runs when the user has finished speaking
    recognition.onresult = async (event) => {
        var transcript = event.results[0][0].transcript;

        // Setting the output to the question the user asked
        output.value = transcript
        
        try {
            // Sending a post request to the server with the user's question
            let res = await axios.post('http://localhost:4001/api/text-to-audio-file', {
                text: event.results[0][0].transcript
            })
            if (res.data) {
                // Setting the audio source to the path of the audio file returned by the server
                mySource.value = '/voice/' + res.data + '.mp3'
                // Playing the audio after a short delay
                setTimeout(() => { player.value.play() }, 500)
            }
        } catch (err) {
            // Logging any errors that occur during the request
            console.log(err)
        }
    };
    
    // Starting the recognition process
    recognition.start();
}
</script>

<!-- Setting up the template for the page -->
<template>
  <div class="btn-section">
    <!-- Button to trigger speech recognition -->
    <button type="button" @click="runSpeechRecognition()">Ask question</button>
  </div>
  <div class="display-section">
      <!-- Displaying the current action (listening, stopped listening, etc.) -->
      <div class="action" v-if="action">{{ action }}</div>
      <!-- Displaying the user's question -->
      <div class="output" v-if="output"><b>Question</b>: {{ output }}</div>
  </div>

  <div>
    <!-- Audio player for the audio file -->
    <audio id="player" ref="player" :src="mySource" type="audio/mpeg" controls hidden></audio>
    <!-- Canvas for the audio visualizer -->
    <canvas ref="canvas" />
  </div>
</template>

<!-- Setting up the CSS for the page -->
<style>
  body {
    background-color: rgb(23, 23, 23);
  }
  canvas {
      padding: 0;
      margin: auto;
      display: block;
      width: 800px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
 

  }
  .btn-section {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  button {
    padding: 8px 13px;
    border-radius: 5px;
    background-color: rgb(81, 148, 81);
    color: white;
    font-weight: 700;
    font-size: 18px;
    border: none;
    cursor: pointer;
  }
  .display-section {
    width: 100%;
    text-align: center;
    color: white;
  }
  .action {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .output {
    max-width: 500px;
    padding: 20px;
    border-radius: 10px;
    border: 1px dotted white;
    display: inline-block;
  }
</style>