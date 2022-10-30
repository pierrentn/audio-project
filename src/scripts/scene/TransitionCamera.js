import gsap from "gsap";
import { Mesh, PlaneGeometry, ShaderMaterial } from "three";
import { lerp } from "three/src/math/MathUtils";
import transitionCameraFrag from "@glsl/transitionCamera.frag";
import transitionCameraVert from "@glsl/transitionCamera.vert";
import Emitter from "@js/utils/Emitter";

class TransitionCamera {
  constructor(scene) {
    this.scene = scene;
    this.isCameraHidden = false;

    this.params = {
      uAlpha: 0,
    };

    this.init();

    Emitter.on("tick", () => this.update());
    // Emitter.on("hideCamera", () => (this.isCameraHidden = true));
    Emitter.on("hideCamera", () => this.hideCamera());
    // Emitter.on("showCamera", () => (this.isCameraHidden = false));
    Emitter.on("showCamera", () => this.showCamera());
  }

  init() {
    this.setTransitionCamera();
  }

  setTransitionCamera() {
    this.geometry = new PlaneGeometry(5, 5);
    this.material = new ShaderMaterial({
      vertexShader: transitionCameraVert,
      fragmentShader: transitionCameraFrag,
      uniforms: {
        uAlpha: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.renderOrder = 999;

    this.scene.add(this.mesh);
  }

  hideCamera() {
    gsap.to(this.params, {
      uAlpha: 1,
      duration: 0.5,
      onUpdate: () =>
        (this.material.uniforms.uAlpha.value = this.params.uAlpha),
      onComplete: () => Emitter.emit("cameraHidden"),
    });
  }
  showCamera() {
    gsap.to(this.params, {
      uAlpha: 0,
      onUpdate: () =>
        (this.material.uniforms.uAlpha.value = this.params.uAlpha),
      duration: 0.5,
    });
  }

  update() {}
}

export default TransitionCamera;
