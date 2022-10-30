import Debug from "@js/utils/Debug";
import Emitter from "@js/utils/Emitter";
import Scene from "@js/SceneManager";

import CamController from "@js/cameras/CamController";
import OrbitCam from "@js/cameras/OrbitCam";
import RadialCam from "@js/cameras/RadialCam";
import CubeCam from "@js/cameras/CubeCam";
import AudioManager from "@js/AudioManager";

let instance = null;
const START_CAMERA = "radialCam";
const SWITCH_DURATION = 200;
const AUTOSWITCH_DELAY = AudioManager.barLength * 2 - SWITCH_DURATION; //BASED ON BPM
class CameraManager {
  constructor(canvas = null) {
    //Singleton
    if (instance) return instance;
    instance = this;

    this.canvas = canvas;
    this.camera = null;
    this.cameraIndex = null;
    this.autoSwitchId = null;

    this.params = {
      autoSwitchEnabled: true,
    };

    this.init();
    Emitter.on(
      "startAudio",
      () => this.params.autoSwitchEnabled && this.enableAutoSwitch()
    );
  }

  init() {
    this.setupCamera();
    this.setupCamDebug();
    // if (this.params.autoSwitchEnabled) this.enableAutoSwitch();
  }

  setupCamera() {
    //Instantiate cameras
    this.cameras = {};
    this.cameras.orbitCam = new OrbitCam(this.canvas);
    this.cameras.radialCam = new RadialCam();
    this.cameras.cubeCam = new CubeCam();

    this.camController = new CamController(Scene);
    this.camController.setCam(this.cameras[START_CAMERA]);
    this.camera = this.camController.mainCameraObject;
  }

  setupCamDebug() {
    const generalFolder = Debug.tabs.pages[0];
    const camDebug = generalFolder.addFolder({ title: "Cameras Controller" });
    camDebug
      .addButton({
        title: "Orbit Camera",
      })
      .on("click", () => this.switchCam(this.cameras.orbitCam));

    camDebug
      .addButton({
        title: "Radial Camera",
      })
      .on("click", () => this.switchCam(this.cameras.radialCam));

    camDebug
      .addButton({
        title: "Cube Camera",
      })
      .on("click", () => this.switchCam(this.cameras.cubeCam));

    camDebug
      .addInput(this.params, "autoSwitchEnabled", {
        label: "Enable Auto Switch",
      })
      .on("change", (ev) => {
        ev.value ? this.enableAutoSwitch() : clearInterval(this.autoSwitchId);
      });
  }

  switchCam(camInstance) {
    Emitter.emit("hideCamera");
    setTimeout(() => {
      this.camController.setCam(camInstance);
      this.camera = this.camController.mainCameraObject;
      // Emitter.emit("switchCam", this.camera);
      Emitter.emit("showCamera");
    }, SWITCH_DURATION);
  }

  enableAutoSwitch() {
    const camerasKey = [];
    for (const cam in this.cameras) {
      camerasKey.push(cam);
    }
    console.log(camerasKey);
    this.cameraIndex = camerasKey.indexOf(START_CAMERA);
    this.autoSwitchId = setInterval(() => {
      const newCamIndex = (this.cameraIndex + 1) % camerasKey.length;
      const newCamKey = camerasKey[newCamIndex];
      this.switchCam(this.cameras[newCamKey]);
      this.cameraIndex = newCamIndex;
    }, AUTOSWITCH_DELAY);
  }
}

export default CameraManager;
