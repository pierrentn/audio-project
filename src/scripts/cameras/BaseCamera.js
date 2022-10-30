import { PerspectiveCamera } from "three";
import Sizes from "../utils/Sizes";

export default class BaseCamera {
  constructor() {
    this.baseInstance = new PerspectiveCamera(
      75,
      Sizes.width / Sizes.height,
      0.01,
      1000
    );

    this.baseOptions = {
      posX: 0,
      posY: 0,
      posZ: 0,
      lookAtX: 0,
      lookAtY: 0,
      lookAtZ: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      angle: 0,
      radius: 0,
    };
  }

  setInitialValues(cam = this.baseInstance, opt = this.baseOption) {
    cam.position.x = opt.posX;
    cam.position.y = opt.posY;
    cam.position.z = opt.posZ;
    cam.rotation.x = opt.rotX;
    cam.rotation.y = opt.rotY;
    cam.rotation.z = opt.rotZ;
    cam.lookAt(opt.lookAtX, opt.lookAtY, opt.lookAtZ);
  }

  resize(cam) {
    cam.aspect = Sizes.width / Sizes.height;
    cam.updateProjectionMatrix();
  }
}
