import { Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";
import Debug from "../utils/Debug";

import Sizes from "../utils/Sizes";
import BaseCamera from "./BaseCamera";

class CubeCam extends BaseCamera {
  constructor() {
    super();
    this.instance = this.baseInstance;

    this.startOpt = {
      ...this.baseOptions,
      posX: -4,
      posY: 1,
      posZ: -4,
      rotY: 4.2,
    };

    this.setInitialValues(this.instance, this.startOpt);
    this.setDebug();
  }

  setDebug() {
    const gui = Debug.tabs.pages[1].addFolder({
      title: "Cube Camera",
      expanded: false,
    });

    //POSITION
    gui
      .addInput(this.startOpt, "posX", {
        min: -10,
        max: 10,
        step: 0.1,
        label: "X Position",
      })
      .on("change", (e) => (this.instance.position.x = e.value));
    gui
      .addInput(this.startOpt, "posY", {
        min: -10,
        max: 10,
        step: 0.1,
        label: "Y Position",
      })
      .on("change", (e) => (this.instance.position.y = e.value));
    gui
      .addInput(this.startOpt, "posZ", {
        min: -10,
        max: 10,
        step: 0.1,
        label: "Z Position",
      })
      .on("change", (e) => (this.instance.position.z = e.value));

    //ROTATION
    gui
      .addInput(this.startOpt, "rotX", {
        min: 0,
        max: Math.PI * 2,
        step: 0.1,
        label: "X rotation",
      })
      .on("change", (e) => (this.instance.rotation.x = e.value));
    gui
      .addInput(this.startOpt, "rotY", {
        min: 0,
        max: Math.PI * 2,
        step: 0.1,
        label: "Y rotation",
      })
      .on("change", (e) => (this.instance.rotation.y = e.value));
    gui
      .addInput(this.startOpt, "rotZ", {
        min: 0,
        max: Math.PI * 2,
        step: 0.1,
        label: "Z rotation",
      })
      .on("change", (e) => (this.instance.rotation.z = e.value));

    //LOOK AT
    gui.addInput(this.startOpt, "lookAtX", {
      min: -10,
      max: 10,
      step: 0.1,
      label: "LookAt X",
    });
    gui.addInput(this.startOpt, "lookAtY", {
      min: -10,
      max: 10,
      step: 0.1,
      label: "LookAt Y",
    });
    gui.addInput(this.startOpt, "lookAtZ", {
      min: -10,
      max: 10,
      step: 0.1,
      label: "LookAt Z",
    });
  }

  update() {
    this.instance.position.y = lerp(this.instance.position.y, 9.1, 0.005);
    // this.instance.rotation.x = lerp(this.instance.rotation.x, 9.1, 0.01);
  }
}

export default CubeCam;
