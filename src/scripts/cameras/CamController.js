import Emitter from "../utils/Emitter";

class CamController {
  constructor(scene) {
    this.scene = scene;
    this.mainCameraInstance = null;
    this.mainCameraObject = null;

    Emitter.on("tick", (elapsed) => this.update(elapsed));
    Emitter.on("resize", () => this.resize());
  }

  setCam(cam) {
    if (this.mainCameraInstance) this.scene.remove(this.mainCameraObject);

    this.mainCameraInstance = cam;
    this.mainCameraInstance.setInitialValues(
      this.mainCameraInstance.instance,
      this.mainCameraInstance.startOpt
    );
    this.mainCameraObject = this.mainCameraInstance.instance;

    this.scene.add(this.mainCameraObject);
  }

  update(dt) {
    this.mainCameraInstance.update && this.mainCameraInstance.update();
  }

  resize() {
    this.mainCameraInstance.resize(this.mainCameraObject);
    // this.mainCamera.resize();
  }
}

export default CamController;
