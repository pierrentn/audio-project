import { PerspectiveCamera, Vector3 } from "three";
import Debug from "../utils/Debug";

import Sizes from "../utils/Sizes";

const V3 = new Vector3();

class RadialCam {
  constructor() {
    this.cameraInstance = new PerspectiveCamera(
      75,
      Sizes.width / Sizes.height,
      0.01,
      1000
    );

    this.options = {
      posX: 15,
      posY: 15,
      posZ: 15,
      lookAtX: -3.7,
      lookAtY: 0,
      lookAtZ: 0,
      radius: 24,
    };

    this.cameraInstance.position.x = this.options.posX;
    this.cameraInstance.position.y = this.options.posY;
    this.cameraInstance.rotation.x = Math.PI / 2;

    this.angle = 0;
    this.radius = this.options.radius;

    this.setDebug();
  }

  setDebug() {
    const gui = Debug.gui.addFolder({ title: "Radial Cam" });

    //POSITION
    // gui
    //   .addInput(this.options, "posX", {
    //     min: -10,
    //     max: 10,
    //     step: 0.1,
    //     label: "X Position",
    //   })
    //   .on("change", (e) => (this.cam.position.x = e.value));
    gui
      .addInput(this.options, "posY", {
        min: -10,
        max: 10,
        step: 0.1,
        label: "Y Position",
      })
      .on("change", (e) => (this.cameraInstance.position.y = e.value));
    // gui
    //   .addInput(this.options, "posZ", {
    //     min: -10,
    //     max: 10,
    //     step: 0.1,
    //     label: "Z Position",
    //   })
    //   .on("change", (e) => (this.cam.position.z = e.value));

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

    gui.addInput(this.options, "radius", {
      min: 0,
      max: 30,
      step: 0.1,
      label: "Radius",
    });
  }

  update() {
    this.angle += 0.01;

    const a = this.angle;
    const x = Math.cos(a) * this.options.radius;
    const z = Math.sin(a) * this.options.radius;

    this.cameraInstance.position.x = x;
    this.cameraInstance.position.z = z;

    this.cameraInstance.lookAt(
      new Vector3(
        this.options.lookAtX,
        this.options.lookAtY,
        this.options.lookAtZ
      )
    );
  }

  resize() {
    this.cameraInstance.aspect = Sizes.width / Sizes.height;
    this.cameraInstance.updateProjectionMatrix();
  }
}

export { RadialCam };
