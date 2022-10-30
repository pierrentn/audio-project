import {
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  MeshPhysicalMaterial,
  TextureLoader,
  Vector2,
  MeshStandardMaterial,
  MeshMatcapMaterial,
  RepeatWrapping,
} from "three";
import Debug from "@js/utils/Debug";
import Ressources from "@js/utils/Ressources";
import terrainVert from "@glsl/terrain.vert";
import terrainFrag from "@glsl/terrain.frag";
import Emitter from "@js/utils/Emitter";
import { lerp } from "three/src/math/MathUtils";
import AudioManager from "@js/AudioManager";

class Terrain {
  constructor(scene) {
    this.scene = scene;

    this.terrainSettings = {
      showWireframe: true,
      uNFrequency: 0.124,
      uNAmplitude: 20,
      uTime: 0,
      uBeat: 0,
      uBassFreq: 0,
      uHightFreq: 0,
      uColor1: { r: 0.01, g: 0.21, b: 1.0 },
      uColor2: { r: 0.18, g: 0.66, b: 0.52 },
    };
    this.init();

    Emitter.on("tick", (e) => this.update(e));
    Emitter.on("beat", (e) => (this.terrainSettings.uBeat = 1.5));
  }

  init() {
    this.setupTerrain();
    this.setupGui();
  }

  setupTerrain() {
    //Terrain
    this.geometry = new PlaneGeometry(80, 80, 512, 512);
    this.material = new ShaderMaterial({
      vertexShader: terrainVert,
      fragmentShader: terrainFrag,
      wireframe: this.terrainSettings.showWireframe,
      uniforms: {
        uNFrequency: { value: this.terrainSettings.uNFrequency },
        uNAmplitude: { value: this.terrainSettings.uNAmplitude },
        uTime: { value: 0 },
        uBeat: { value: this.terrainSettings.uBeat },
        uColor1: { value: this.terrainSettings.uColor1 },
        uColor2: { value: this.terrainSettings.uColor2 },
        uHightFreq: { value: this.terrainSettings.uHightFreq },
      },
      transparent: true,
    });
    // this.setStandardMat();

    this.terrain = new Mesh(this.geometry, this.material);
    this.terrain.material.userData.needsUpdatedReflections = true;
    this.terrain.position.set(0, 0, 0);
    this.terrain.rotation.x = -Math.PI / 2;

    this.scene.add(this.terrain);
  }

  setStandardMat() {
    const rockColor = Ressources.items["rockColor"];
    rockColor.wrapS = RepeatWrapping;
    rockColor.wrapT = RepeatWrapping;
    rockColor.repeat.x = 4;
    rockColor.repeat.y = 4;
    const rockNormal = Ressources.items["rockNormal"];
    rockNormal.wrapS = RepeatWrapping;
    rockNormal.wrapT = RepeatWrapping;
    rockNormal.repeat.x = 4;
    rockNormal.repeat.y = 4;
    this.material = new MeshStandardMaterial({
      map: Ressources.items["rockColor"],
      aoMap: Ressources.items["rockAO"],
      normalMap: Ressources.items["rockNormal"],
      normalScale: new Vector2(0.5),
      roughness: 0.9,
    });
    // this.material = new MeshMatcapMaterial({
    //   map: Ressources.items["matcapTexture"],
    // });
    this.material.onBeforeCompile = (shader) => {
      console.log(shader.vertexShader);
      shader.uniforms.uNFrequency = { value: this.terrainSettings.uNFrequency };
      shader.uniforms.uNAmplitude = { value: this.terrainSettings.uNAmplitude };

      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
          #include <common>

          vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
          vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
          vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

          float noise(vec3 P){
            vec3 Pi0 = floor(P); // Integer part for indexing
            vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
            Pi0 = mod(Pi0, 289.0);
            Pi1 = mod(Pi1, 289.0);
            vec3 Pf0 = fract(P); // Fractional part for interpolation
            vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.yy, Pi1.yy);
            vec4 iz0 = Pi0.zzzz;
            vec4 iz1 = Pi1.zzzz;

            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0);
            vec4 ixy1 = permute(ixy + iz1);

            vec4 gx0 = ixy0 / 7.0;
            vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);

            vec4 gx1 = ixy1 / 7.0;
            vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);

            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x;
            g010 *= norm0.y;
            g100 *= norm0.z;
            g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x;
            g011 *= norm1.y;
            g101 *= norm1.z;
            g111 *= norm1.w;

            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
            float n111 = dot(g111, Pf1);

            vec3 fade_xyz = fade(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
            return 2.2 * n_xyz;
          }

          float fbm(vec3 x) {
            float v = 0.0;
            float a = 0.5;
            vec3 shift = vec3(100);
            for (int i = 0; i < 10; ++i) {
              v += a * noise(x);
              x = x * 2.0 + shift;
              a *= 0.5;
            }
            return v;
          }

          uniform float uNFrequency;
          uniform float uNAmplitude;

          varying float vDist;
          varying float vNoise;
          // varying vec3 vNormal;
      `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
          #include <begin_vertex>

          float dist = distance(vec2(0.5), uv);
          dist = smoothstep(0.1, 0.2, dist);

          //Noise
          float nFrequency = uNFrequency;
          float nAmpl = uNAmplitude;
          float n = max(0., fbm(position * nFrequency));
          n = (n * dist) * nAmpl;
          vec3 nPos = position;
          transformed.z += n;

          vDist = dist;
          vNoise = n;
          vNormal = normal + n;

      `
      );
    };
  }

  setupGui() {
    const gui = Debug.tabs.pages[1].addFolder({
      title: "Terrain",
      expanded: false,
    });

    gui
      .addInput(this.terrainSettings, "showWireframe")
      .on("change", (e) => (this.material.wireframe = e.value));
    gui
      .addInput(this.terrainSettings, "uNFrequency", {
        min: 0.001,
        max: 0.5,
        step: 0.001,
      })
      .on(
        "change",
        (e) => (this.material.uniforms.uNFrequency.value = e.value)
      );
    gui
      .addInput(this.terrainSettings, "uNAmplitude", {
        min: 0.0,
        max: 50,
        step: 0.01,
      })
      .on(
        "change",
        (e) => (this.material.uniforms.uNAmplitude.value = e.value)
      );
    gui.addInput(this.terrainSettings, "uColor1", {
      color: { type: "float" },
    });
    gui.addInput(this.terrainSettings, "uColor2", {
      color: { type: "float" },
    });
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed * 0.6;
    if (!AudioManager.dropPlayed) {
      this.terrainSettings.uBassFreq = lerp(
        this.terrainSettings.uBassFreq,
        AudioManager.values[1],
        0.01
      );
      this.material.uniforms.uBeat.value = this.terrainSettings.uBassFreq;
    } else {
      const nuBeat = lerp(this.terrainSettings.uBeat, 0, 0.1);
      this.terrainSettings.uBeat = nuBeat;
      this.material.uniforms.uBeat.value = nuBeat;
    }
    this.terrainSettings.uHightFreq = lerp(
      this.terrainSettings.uHightFreq,
      AudioManager.values[3],
      0.1
    );
    this.material.uniforms.uHightFreq.value = this.terrainSettings.uHightFreq;
  }
}

export default Terrain;
