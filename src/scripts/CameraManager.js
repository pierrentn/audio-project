import Debug from "@js/utils/Debug";
import Emitter from "@js/utils/Emitter";
import Scene from "@js/SceneManager";

import CamController from "@js/cameras/CamController";
import OrbitCam from "@js/cameras/OrbitCam";
import RadialCam from "@js/cameras/RadialCam";
import CubeCam from "@js/cameras/CubeCam";

let instance = null;

class CameraManager {
  constructor(canvas = null) {
    //Singleton
    if (instance) return instance;
    instance = this;

    this.canvas = canvas;
    this.camera = null;
    this.init();
  }

  init() {
    this.setupCamera();
    this.setupCamDebug();
  }

  setupCamera() {
    //Instantiate cameras
    this.cameras = {};
    this.cameras.orbitCam = new OrbitCam(this.canvas);
    this.cameras.radialCam = new RadialCam();
    this.cameras.cubeCam = new CubeCam();

    this.camController = new CamController(Scene);
    this.camController.setCam(this.cameras.orbitCam);
    this.camera = this.camController.mainCameraObject;
  }

  setupCamDebug() {
    const generalFolder = Debug.tabs.pages[0];
    const camDebug = generalFolder.addFolder({ title: "Cameras Controller" });
    camDebug
      .addButton({
        title: "Orbit Camera",
      })
      .on("click", () => this.camSwitch(this.cameras.orbitCam));

    camDebug
      .addButton({
        title: "Radial Camera",
      })
      .on("click", () => this.camSwitch(this.cameras.radialCam));

    camDebug
      .addButton({
        title: "Cube Camera",
      })
      .on("click", () => this.camSwitch(this.cameras.cubeCam));
  }

  camSwitch(camInstance) {
    Emitter.emit("hideCamera");
    setTimeout(() => {
      this.camController.setCam(camInstance);
      this.camera = this.camController.mainCameraObject;
      // Emitter.emit("camSwitch", this.camera);
      Emitter.emit("showCamera");
    }, 500);
  }
}

export default CameraManager;
