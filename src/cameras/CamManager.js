import Emitter from "../utils/Emitter";

class CamManager {
  constructor(scene) {
    this.scene = scene;
    this.mainCamera = null;

    Emitter.on("tick", (elapsed) => this.update(elapsed));
    Emitter.on("resize", () => this.resize());
  }

  setCam(cam) {
    if (this.mainCamera) this.scene.remove(this.mainCamera.cameraInstance);

    this.mainCamera = cam;
    Emitter.emit("switchCam", cam);
    // Emitter.emit("newCam", this.cam.cam);
    this.scene.add(this.mainCamera.cameraInstance);
  }

  update(dt) {
    this.mainCamera.update && this.mainCamera.update();
  }

  resize() {
    this.mainCamera.resize();
  }
}

export { CamManager };
