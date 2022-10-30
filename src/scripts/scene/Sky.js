import { DoubleSide, Mesh, ShaderMaterial, SphereGeometry } from "three";
import skyVert from "@glsl/sky.vert";
import skyFrag from "@glsl/sky.frag";
import Emitter from "@js/utils/Emitter";
import AudioManager from "@js/AudioManager";
import { lerp } from "three/src/math/MathUtils";

class Sky {
  constructor(scene) {
    this.scene = scene;

    this.skySettings = {
      uBassFreq: 0,
      uMediumFreq: 0,
      uIsEnabled: 0,
      uColor1: { r: 0.01, g: 0.21, b: 1.0 },
      uColor2: { r: 0.18, g: 0.66, b: 0.52 },
    };

    this.init();

    Emitter.on("tick", (e) => this.update(e));
    Emitter.on("musicDrop", (e) => (this.skySettings.uIsEnabled = 1));
  }

  init() {
    this.setupsky();
  }

  setupsky() {
    this.geometry = new SphereGeometry(60, 60, 60);
    this.material = new ShaderMaterial({
      side: DoubleSide,
      vertexShader: skyVert,
      fragmentShader: skyFrag,
      uniforms: {
        uTime: { value: 0 },
        uBassFreq: { value: 0 },
        uMediumFreq: { value: 0 },
        uColor1: { value: this.skySettings.uColor1 },
        uColor2: { value: this.skySettings.uColor2 },
        uIsEnabled: { value: this.skySettings.uIsEnabled },
      },
      transparent: true,
    });
    this.sky = new Mesh(this.geometry, this.material);
    this.sky.name = "Sky";
    this.sky.material.userData.needsUpdatedReflections = true;
    this.scene.add(this.sky);
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed;
    // this.skySettings.uBassFreq = AudioManager.values[0];

    this.skySettings.uBassFreq = lerp(
      this.skySettings.uBassFreq,
      AudioManager.values[1],
      0.05
    );
    this.material.uniforms.uBassFreq.value = this.skySettings.uBassFreq;

    this.skySettings.uMediumFreq = lerp(
      this.skySettings.uMediumFreq,
      AudioManager.values[2],
      0.05
    );
    this.material.uniforms.uMediumFreq.value = this.skySettings.uMediumFreq;

    this.material.uniforms.uIsEnabled.value = lerp(
      this.material.uniforms.uIsEnabled.value,
      this.skySettings.uIsEnabled,
      0.4
    );

    // this.sky.rotation.y += this.skySettings.uMediumFreq * 0.025;
  }
}

export default Sky;
