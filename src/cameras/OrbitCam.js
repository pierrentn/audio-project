import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Sizes from "../utils/Sizes";

class OrbitCam {
  constructor(el) {
    this.cameraInstance = new PerspectiveCamera(
      75,
      Sizes.width / Sizes.height,
      0.01,
      1000
    );

    this.cameraInstance.position.set(-7, 7, 25);

    this.controls = new OrbitControls(this.cameraInstance, el);
    this.controls.maxPolarAngle = Math.PI / 2.2;
  }

  update() {
    this.controls.update();
  }

  resize() {
    this.cameraInstance.aspect = Sizes.width / Sizes.height;
    this.cameraInstance.updateProjectionMatrix();
  }
}

export { OrbitCam };
