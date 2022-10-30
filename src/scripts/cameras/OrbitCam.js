import { PerspectiveCamera, Quaternion } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Sizes from "../utils/Sizes";
import BaseCamera from "./BaseCamera";

class OrbitCam extends BaseCamera {
  constructor(canvas) {
    super();
    this.canvas = canvas;

    this.instance = this.baseInstance;
    this.startOpt = {
      ...this.baseOptions,
      posX: -7,
      posY: 7,
      posZ: 25,
    };
    this.instance.position.set(
      this.startOpt.posX,
      this.startOpt.posY,
      this.startOpt.posZ
    );

    this.setControls();
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.maxPolarAngle = Math.PI / 2.2;
    console.log(this.instance.position, this.instance.rotation);
  }
}

export default OrbitCam;
