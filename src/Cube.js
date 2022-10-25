import { BoxGeometry, Mesh, ShaderMaterial } from "three";
import Emitter from "./utils/Emitter";
import cubeVert from "./shaders/cube.vert";
import cubeFrag from "./shaders/cube.frag";

class Cube {
  constructor(scene) {
    this.scene = scene;

    this.init();
    Emitter.on("tick", (elapsed) => this.update(elapsed));
  }

  init() {
    this.setupCube();
  }

  setupCube() {
    this.geometry = new BoxGeometry(5, 5, 5);
    this.material = new ShaderMaterial({
      vertexShader: cubeVert,
      fragmentShader: cubeFrag,
      uniforms: {
        uTime: { value: 0 },
      },
    });
    this.cube = new Mesh(this.geometry, this.material);
    this.scene.add(this.cube);
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed;
  }
}

export default Cube;
