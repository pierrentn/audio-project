import { PerspectiveCamera, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";
import Debug from "../utils/Debug";
import Emitter from "../utils/Emitter";

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
      // radius: 24,
      radius: 70,
    };

    this.updatedOpt = {
      ...this.startOpt,
      radius: 24,
    };

    this.introAnimationEnded = false;
    this.introAnimationStarted = false;

    this.setInitialValues(this.instance, this.startOpt);
    this.setDebug();

    Emitter.on("startAudio", () => (this.introAnimationStarted = true));
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
        min: -100,
        max: 100,
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
      max: 100,
      step: 0.1,
      label: "Radius",
    });
  }

  update() {
    if (this.introAnimationStarted) {
      this.startOpt.radius = lerp(
        this.startOpt.radius,
        this.updatedOpt.radius,
        0.01
      );
    }
    let radius = this.startOpt.radius;
    // introAnimationEnded

    this.startOpt.angle += 0.01;
    const a = this.startOpt.angle;
    const x = Math.cos(a) * radius;
    const z = Math.sin(a) * radius;

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
