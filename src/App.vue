<template>
  <div>
    <div v-if="!listening" class="btn-section">
      <button type="button" @click="toggleListening()">
        Ask question
      </button>
    </div>
    <div v-if="listening" class="recordingIcon">
      <img src="./assets/recording.gif" />
    </div>
    <div class="display-section">
      <div class="action" v-if="action">
        {{ action }}
      </div>
      <div class="output" v-if="output">
        <b>Question</b>:
        {{ output }}
      </div>
    </div>
    <audio
      id="player"
      ref="player"
      :src="mySource"
      type="audio/mpeg"
      controls
      hidden
    ></audio>
    <canvas ref="canvas" />
  </div>
</template>

<script>
import { ref } from "vue";
import { useAVLine } from "vue-audio-visual";
import axios from "axios";

export default {
  setup() {
    const player = ref(null);
    const canvas = ref(null);
    const mySource = ref(null);
    const action = ref("");
    const output = ref("");
    const listening = ref(false);

    useAVLine(player, canvas, {
      src: mySource,
      canvHeight: 300,
      canvWidth: 1000,
      barColor: "lime",
    });

    const toggleListening = () => {
      if (listening.value) {
        action.value = "stopped listening...";
        listening.value = false;
      } else {
        action.value = "";
        listening.value = true;
        runSpeechRecognition();
      }
    };

    const runSpeechRecognition = () => {
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
      var recognition = new SpeechRecognition();
  

      recognition.onstart = () => {
        // no change
      };

      recognition.onspeechend = () => {
        // no change
        recognition.stop();
      };

      recognition.onresult = async (event) => {
        var transcript = event.results[0][0].transcript;
        listening.value = false;
        output.value = transcript;

        try {
          let res = await axios.post(
            "http://localhost:4001/api/text-to-audio-file",
            {
              text: event.results[0][0].transcript,
            }
          );

          if (res.data) {
            mySource.value = "/voice/" + res.data + ".mp3";
            setTimeout(() => {
              player.value.play();
            }, 100);
          }
        } catch (err) {
          console.log(err);
        }
      };

      recognition.start();
    };

    return {
      player,
      canvas,
      mySource,
      action,
      output,
      listening,
      toggleListening,
    };
  },
};
</script>

<style>
body {
  background-color: #000000;
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
  margin-top:35px;
}

.recordingIcon{
  margin:0px auto;
  text-align:center;
}

.recordingIcon img{
  max-width:30%;
}
</style>
