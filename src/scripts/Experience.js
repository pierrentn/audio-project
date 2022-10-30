import Emitter from "@js/utils/Emitter";
import Raf from "@js/utils/Raf";
import Engine from "@js/Engine";
import Scene from "@js/SceneManager";
import Ressources from "@js/utils/Ressources";
import AudioManager from "@js/AudioManager";
import Debug from "@js/utils/Debug";
import CameraManager from "@js/CameraManager";

class Experience {
  constructor() {
    this.ressources = Ressources;
    this.debug = Debug;
    this.canvas = document.querySelector("#webgl-canvas");

    if (this.ressources.sources.length) {
      Emitter.on("loadingReady", (e) => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.scene = Scene;
    this.cameraManager = new CameraManager(this.canvas);
    this.audioManger = AudioManager;
    this.engine = new Engine(this.canvas);
  }
}

export default Experience;
