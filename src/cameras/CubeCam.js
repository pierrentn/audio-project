import { PerspectiveCamera, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";
import Debug from "../utils/Debug";

import Sizes from "../utils/Sizes";

const V3 = new Vector3();

class CubeCam {
  constructor() {
    this.cameraInstance = new PerspectiveCamera(
      75,
      Sizes.width / Sizes.height,
      0.01,
      1000
    );

    this.options = {
      posX: -4,
      posY: 1,
      posZ: -4,
      lookAtX: 0,
      lookAtY: 0,
      lookAtZ: 0,
      rotX: 0,
      rotY: 4.2,
      rotZ: 0,
    };

    this.cameraInstance.position.x = this.options.posX;
    this.cameraInstance.position.y = this.options.posY;
    this.cameraInstance.position.z = this.options.posZ;
    this.cameraInstance.rotation.x = this.options.rotX;
    this.cameraInstance.rotation.y = this.options.rotY;
    this.cameraInstance.rotation.z = this.options.rotZ;

    this.setDebug();
  }

  setDebug() {
    const gui = Debug.gui.addFolder({ title: "Cube cameraInstance" });

    //POSITION
    gui
      .addInput(this.options, "posX", {
        min: -10,
        max: 10,
        step: 0.1,
        label: "X Position",
      })
      .on("change", (e) => (this.cameraInstance.position.x = e.value));
    gui
      .addInput(this.options, "posY", {
        min: -10,
        max: 10,
        step: 0.1,
        label: "Y Position",
      })
      .on("change", (e) => (this.cameraInstance.position.y = e.value));
    gui
      .addInput(this.options, "posZ", {
        min: -10,
        max: 10,
        step: 0.1,
        label: "Z Position",
      })
      .on("change", (e) => (this.cameraInstance.position.z = e.value));

    //ROTATION
    gui
      .addInput(this.options, "rotX", {
        min: 0,
        max: Math.PI * 2,
        step: 0.1,
        label: "X rotation",
      })
      .on("change", (e) => (this.cameraInstance.rotation.x = e.value));
    gui
      .addInput(this.options, "rotY", {
        min: 0,
        max: Math.PI * 2,
        step: 0.1,
        label: "Y rotation",
      })
      .on("change", (e) => (this.cameraInstance.rotation.y = e.value));
    gui
      .addInput(this.options, "rotZ", {
        min: 0,
        max: Math.PI * 2,
        step: 0.1,
        label: "Z rotation",
      })
      .on("change", (e) => (this.cameraInstance.rotation.z = e.value));

    //LOOK AT
    gui.addInput(this.options, "lookAtX", {
      min: -10,
      max: 10,
      step: 0.1,
      label: "LookAt X",
    });
    gui.addInput(this.options, "lookAtY", {
      min: -10,
      max: 10,
      step: 0.1,
      label: "LookAt Y",
    });
    gui.addInput(this.options, "lookAtZ", {
      min: -10,
      max: 10,
      step: 0.1,
      label: "LookAt Z",
    });
  }

  update() {
    this.cameraInstance.position.y = lerp(
      this.cameraInstance.position.y,
      9.1,
      0.005
    );
    // this.cameraInstance.rotation.x = lerp(this.cameraInstance.rotation.x, 9.1, 0.01);
  }

  resize() {
    this.cameraInstance.aspect = Sizes.width / Sizes.height;
    this.cameraInstance.updateProjectionMatrix();
  }
}

export { CubeCam };
