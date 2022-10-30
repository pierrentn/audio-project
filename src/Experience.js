import Emitter from "./utils/Emitter";
import Raf from "./utils/Raf";
import Engine from "./Engine";
import { Fog, Scene } from "three";
import Ressources from "./utils/Ressources";
import AudioManager from "./AudioManager";
import Debug from "./utils/Debug";

class Experience {
  constructor() {
    this.raf = new Raf();

    this.ressources = Ressources;
    this.canvas = document.querySelector("#webgl-canvas");
    // this.startBtn = document.querySelector("#startBtn");

    Emitter.on("tick", (e) => this.update(e));
    Emitter.on("loadingReady", (e) => this.init());
    const startBtn = Debug.gui.addButton({ title: "start" });
    startBtn.on("click", () => {
      Emitter.emit("startAudio");
    });
  }

  init() {
    this.scene = new Scene();
    // this.scene.fog = new Fog(0x000000, 1, 70);
    this.audioManger = AudioManager;
    this.engine = new Engine(this.canvas, this.scene);
  }

  update(e) {
    const elapsed = e;
  }
}

export default Experience;
