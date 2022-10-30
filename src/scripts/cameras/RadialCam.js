import { PerspectiveCamera, Vector3 } from "three";
import Debug from "../utils/Debug";

import Sizes from "../utils/Sizes";
import BaseCamera from "./BaseCamera";

const V3 = new Vector3();

class RadialCam extends BaseCamera {
  constructor() {
    super();
    this.instance = new PerspectiveCamera(
      75,
      Sizes.width / Sizes.height,
      0.01,
      1000
    );

    this.startOpt = {
      ...this.baseOptions,
      posX: 15,
      posY: 15,
      posZ: 15,
      lookAtX: -3.7,
      rotX: Math.PI / 2,
      angle: 0,
      radius: 24,
    };

    this.setInitialValues(this.instance, this.startOpt);
    this.setDebug();
  }

  setDebug() {
    const gui = Debug.tabs.pages[1].addFolder({
      title: "Radial Camera",
      expanded: false,
    });

    //POSITION
    // gui
    //   .addInput(this.startOpt, "posX", {
    //     min: -10,
    //     max: 10,
    //     step: 0.1,
    //     label: "X Position",
    //   })
    //   .on("change", (e) => (this.cam.position.x = e.value));
    gui
      .addInput(this.startOpt, "posY", {
        min: -10,
        max: 10,
        step: 0.1,
        label: "Y Position",
      })
      .on("change", (e) => (this.instance.position.y = e.value));
    // gui
    //   .addInput(this.startOpt, "posZ", {
    //     min: -10,
    //     max: 10,
    //     step: 0.1,
    //     label: "Z Position",
    //   })
    //   .on("change", (e) => (this.cam.position.z = e.value));
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

    gui.addInput(this.startOpt, "radius", {
      min: 0,
      max: 30,
      step: 0.1,
      label: "Radius",
    });
  }

  update() {
    this.startOpt.angle += 0.01;
    const a = this.startOpt.angle;
    const x = Math.cos(a) * this.startOpt.radius;
    const z = Math.sin(a) * this.startOpt.radius;

    this.instance.position.x = x;
    this.instance.position.z = z;

    this.instance.lookAt(
      new Vector3(
        this.startOpt.lookAtX,
        this.startOpt.lookAtY,
        this.startOpt.lookAtZ
      )
    );
  }
}

export default RadialCam;
