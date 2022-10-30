import Audio from "./utils/audio.js";
import Emitter from "./utils/Emitter.js";

class AudioManager {
  constructor() {
    this.audioStarted = false;
    this.dropTimer = 96.2;
    this.dropPlayed = false;
    this.values = [0, 0, 0, 0, 0];
    this.volume = 0;
    Emitter.on("startAudio", () => this.startAudio());
    Emitter.on("tick", (elapsed) => this.update(elapsed));
  }

  startAudio() {
    this.audio = new Audio();

    this.audio.start({
      // src: "audio/Allegri.flac",
      src: "audio/brest.mp3",
      live: false,
      onBeat: this.onBeat,
      startTime: 40, //24
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
      if (this.audio.audio.currentTime >= this.dropTimer && !this.dropPlayed) {
        this.dropPlayed = true;
        Emitter.emit("musicDrop");
      }
    }
  }
}

export default new AudioManager();
