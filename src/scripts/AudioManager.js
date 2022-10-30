import Audio from "./utils/audio.js";
import Emitter from "./utils/Emitter.js";
import Ressources from "./utils/Ressources.js";

const DROP_TIME = 96.2;
const BAR_LENGTH = 2996;
// const START_TIME = (BAR_LENGTH * 35) / 1000;
const START_TIME = (BAR_LENGTH * 10) / 1000;
// const START_TIME = 95;
console.log(START_TIME);

class AudioManager {
  constructor() {
    this.audioStarted = false;
    this.dropPlayed = false;
    this.values = [0, 0, 0, 0, 0];
    this.volume = 0;
    //TODO: update this
    this.barLength = BAR_LENGTH;
    Emitter.on("startAudio", () => this.startAudio());
    Emitter.on("tick", (elapsed) => this.update(elapsed));
    Emitter.on("showSoundDebug", () => this.toggleDebug());
  }

  startAudio() {
    this.audio = new Audio();
    this.audio.start({
      // src: "audio/Allegri.flac",
      src: "audio/brest.mp3",
      live: false,
      onBeat: this.onBeat,
      startTime: START_TIME, //24
    });
    this.audioStarted = true;
  }

  onBeat() {
    // console.log("onBeat");
    Emitter.emit("beat");
  }

  update(elapsed) {
    if (this.audioStarted) {
      this.audio.update();
      this.values = this.audio.values;
      this.volume = this.audio.volume;
      if (this.audio.audio.currentTime >= DROP_TIME && !this.dropPlayed) {
        this.dropPlayed = true;
        Emitter.emit("musicDrop");
      }
    }
  }

  toggleDebug() {
    if (!this.audioStarted) return;
    document.querySelector("#audio-canvas").classList.toggle("hidden");
  }
}

export default new AudioManager();
