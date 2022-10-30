import { Mesh, PlaneGeometry, ShaderMaterial } from "three";
import { lerp } from "three/src/math/MathUtils";
import transitionCameraFrag from "@glsl/transitionCamera.frag";
import transitionCameraVert from "@glsl/transitionCamera.vert";
import Emitter from "@js/utils/Emitter";

class TransitionCamera {
  constructor(scene) {
    this.scene = scene;
    this.isCameraHidden = false;

    this.init();

    Emitter.on("tick", () => this.update());
    Emitter.on("hideCamera", () => (this.isCameraHidden = true));
    Emitter.on("showCamera", () => (this.isCameraHidden = false));
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
    });
    this.mesh = new Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  update() {
    this.material.uniforms.uAlpha.value = lerp(
      this.material.uniforms.uAlpha.value,
      this.isCameraHidden ? 1 : 0,
      0.2
    );
  }
}

export default TransitionCamera;
