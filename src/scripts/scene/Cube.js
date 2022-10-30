import { BoxGeometry, Mesh, ShaderMaterial } from "three";
import cubeVert from "@glsl/cube.vert";
import cubeFrag from "@glsl/cube.frag";
import Emitter from "@js/utils/Emitter";
import Ressources from "@js/utils/Ressources";
import Debug from "@js/utils/Debug";
import AudioManager from "@js/AudioManager";
import { lerp } from "three/src/math/MathUtils";

class Cube {
  constructor(scene) {
    this.scene = scene;

    this.cubeSettings = {
      uTime: 0,
      // uGradient: Ressources.items["gradient"],
      uColor1: { r: 0.22, g: 0.91, b: 0.96 },
      uColor2: { r: 0.82, g: 0.0, b: 0.39 },
      uColor3: { r: 0.04, g: 0.11, b: 0.84 },
      uColor4: { r: 1.0, g: 0.0, b: 0.43 },
      uHightFreq: 0,
      uBassFreq: 0,
    };

    this.init();
    Emitter.on("tick", (elapsed) => this.update(elapsed));
  }

  init() {
    this.setupCube();
    this.setDebug();
  }

  setupCube() {
    this.geometry = new BoxGeometry(3.5, 10, 3.5);
    this.material = new ShaderMaterial({
      vertexShader: cubeVert,
      fragmentShader: cubeFrag,
      uniforms: {
        uTime: { value: this.cubeSettings.uTime },
        // // uGradient: { value: this.cubeSettings.uGradient },
        uColor1: { value: this.cubeSettings.uColor1 },
        uColor2: { value: this.cubeSettings.uColor2 },
        uColor3: { value: this.cubeSettings.uColor3 },
        uColor4: { value: this.cubeSettings.uColor4 },
        uHightFreq: { value: this.cubeSettings.uHightFreq },
        uBassFreq: { value: this.cubeSettings.uBassFreq },
      },
    });
    this.cube = new Mesh(this.geometry, this.material);
    this.cube.position.set(0, 5.5, 0);
    this.scene.add(this.cube);

    const transparentGeo = new BoxGeometry(4.5, 12, 4.5);
    const transparentMat = new ShaderMaterial({
      vertexShader: `
        void main() {
          gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(.0);
        }
      `,
      transparent: true,
    });
    const transparentCube = new Mesh(transparentGeo, transparentMat);
    transparentCube.position.set(0, 6.5, 0);
    this.scene.add(transparentCube);
  }

  setDebug() {
    const gui = Debug.tabs.pages[1].addFolder({
      title: "Cube",
      expanded: false,
    });
    gui.addInput(this.cubeSettings, "uColor1", {
      color: { type: "float" },
    });
    gui.addInput(this.cubeSettings, "uColor2", {
      color: { type: "float" },
    });
    gui.addInput(this.cubeSettings, "uColor3", {
      color: { type: "float" },
    });
    gui.addInput(this.cubeSettings, "uColor4", {
      color: { type: "float" },
    });
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed;

    this.cubeSettings.uHightFreq = lerp(
      this.cubeSettings.uHightFreq,
      AudioManager.values[3],
      0.1
    );
    this.material.uniforms.uHightFreq.value = this.cubeSettings.uHightFreq;
    this.cubeSettings.uBassFreq = lerp(
      this.cubeSettings.uBassFreq,
      AudioManager.values[0],
      0.1
    );
    this.material.uniforms.uBassFreq.value = this.cubeSettings.uBassFreq;
  }
}

export default Cube;
