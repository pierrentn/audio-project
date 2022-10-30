import {
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  AmbientLight,
  DirectionalLightHelper,
  Mesh,
  BoxGeometry,
  MeshNormalMaterial,
  MeshStandardMaterial,
} from "three";
import * as POSTPROCESSING from "postprocessing";
import { SSRDebugGUI } from "./utils/SSRDebugGUI";
import { SSREffect, defaultSSROptions } from "screen-space-reflections";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Sizes from "./utils/Sizes";
import Debug from "./utils/Debug";
import Emitter from "./utils/Emitter";
import Terrain from "./Terrain";
import Cube from "./Cube";
import Sky from "./Sky";
import TransitionCamera from "./TransitionCamera";
import { CamManager } from "./cameras/CamManager";
import { OrbitCam } from "./cameras/OrbitCam";
import { RadialCam } from "./cameras/RadialCam";
import { CubeCam } from "./cameras/CubeCam";

class Engine {
  constructor(canvas, scene) {
    this.canvas = canvas;
    this.scene = scene;

    this.canvas.style.width = Sizes.width;
    this.canvas.style.height = Sizes.height;
    this.canvas.width = Sizes.width * Sizes.dpr;
    this.canvas.height = Sizes.height * Sizes.dpr;

    this.init();

    Emitter.on("resize", () => this.onResize());
    Emitter.on("tick", (e) => this.update(e));
    Emitter.on("switchCam", (cam) => this.switchCam(cam));
  }

  init() {
    this.setupCamera();
    this.setupScene();
    this.setupRenderer();
    this.setupPostProcessing();
  }

  setupCamera() {
    this.orbitCam = new OrbitCam(this.canvas);
    this.radialCam = new RadialCam();
    this.cubeCam = new CubeCam();
    this.camManager = new CamManager(this.scene);

    this.camManager.setCam(this.orbitCam);

    this.setupCamDebug();
    // this.controls = new OrbitControls(this.camManager.mainCamera.cameraInstance, this.renderer.domElement);
  }

  switchCam(cam) {
    console.log(this.scene.children.length);
    this.setupPostProcessing();
  }

  setupCamDebug() {
    const camDebug = Debug.gui.addFolder({ title: "Cam Controller" });

    const orbitBtn = camDebug.addButton({
      title: "Orbit Camera",
    });
    orbitBtn.on("click", () => {
      Emitter.emit("hideCamera");
      setTimeout(() => {
        this.camManager.setCam(this.orbitCam);
        Emitter.emit("showCamera");
      }, 500);
    });
    const radialBtn = camDebug.addButton({
      title: "Radial Camera",
    });
    radialBtn.on("click", () => {
      Emitter.emit("hideCamera");
      setTimeout(() => {
        this.camManager.setCam(this.radialCam);
        Emitter.emit("showCamera");
      }, 500);
    });
    const cubeBtn = camDebug.addButton({
      title: "Cube Camera",
    });
    cubeBtn.on("click", () => {
      Emitter.emit("hideCamera");
      setTimeout(() => {
        this.camManager.setCam(this.cubeCam);
        Emitter.emit("showCamera");
      }, 500);
    });
  }

  setupRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(Sizes.width, Sizes.height);
    this.renderer.setPixelRatio(Sizes.dpr);
  }

  setupPostProcessing() {
    this.postParams = {
      ssrOpt: {
        ...defaultSSROptions,
        enabled: true,
        resolutionScale: 1,
        velocityResolutionScale: 1,
        correctionRadius: 2,
        blend: 0.95,
        correction: 0.1,
        blur: 0,
        blurSharpness: 10,
        blurKernel: 1,
        distance: 10,
        intensity: 1,
        exponent: 1.75,
        maxRoughness: 0.99,
        jitter: 0.98,
        jitterRoughness: 3.51,
        roughnessFade: 1,
        fade: 1.03,
        thickness: 3.5,
        ior: 1.75,
        fade: 0,
        steps: 5,
        refineSteps: 6,
        maxDepthDifference: 50,
        missedRays: false,
      },
      bloomOpt: {
        blendFunction: POSTPROCESSING.BlendFunction.ADD,
        blendFunctionNoise: POSTPROCESSING.BlendFunction.COLOR_BURN, // substract // MULTIPLY // Overlay
        mipmapBlur: true,
        luminanceThreshold: 0.4,
        luminanceSmoothing: 0.3,
        intensity: 2.0,
      },
    };

    this.composer = new POSTPROCESSING.EffectComposer(this.renderer);

    this.effect = {};

    this.effect.ssr = new SSREffect(
      this.scene,
      this.camManager.mainCamera.cameraInstance
    );

    this.effect.bloom = new POSTPROCESSING.SelectiveBloomEffect(
      this.scene,
      this.camManager.mainCamera.cameraInstance,
      {
        blendFunction: this.postParams.bloomOpt.blendFunction,
        mipmapBlur: this.postParams.bloomOpt.mipmapBlur,
        luminanceThreshold: this.postParams.bloomOpt.luminanceThreshold,
        luminanceSmoothing: this.postParams.bloomOpt.luminanceSmoothing,
        intensity: this.postParams.bloomOpt.intensity,
      }
    );
    this.effect.bloom.inverted = true;

    this.passes = {};

    this.passes.render = new POSTPROCESSING.RenderPass(
      this.scene,
      this.camManager.mainCamera.cameraInstance
    );

    this.passes.ssr = new POSTPROCESSING.EffectPass(
      this.camManager.mainCamera.cameraInstance,
      this.effect.ssr
    );

    this.passes.bloom = new POSTPROCESSING.EffectPass(
      this.camManager.mainCamera.cameraInstance,
      this.effect.bloom
    );

    this.composer.addPass(this.passes.render);
    this.composer.addPass(this.passes.ssr);
    this.composer.addPass(this.passes.bloom);

    // const ssrGui = new SSRDebugGUI(
    //   this.effect.ssr,
    //   Debug.gui,
    //   this.postParams.ssrOpt
    // );
  }

  setupScene() {
    this.terrain = new Terrain(this.scene);
    this.cube = new Cube(this.scene);
    this.sky = new Sky(this.scene);
    this.transitionCamera = new TransitionCamera(this.scene);
  }

  onResize() {
    // Update Camera
    // this.camManager.mainCamera.cameraInstance.aspect = Sizes.width / Sizes.height;
    // this.camManager.mainCamera.cameraInstance.updateProjectionMatrix();
    this.camManager.resize();

    //update renderer
    this.renderer.setSize(Sizes.width, Sizes.height);
    this.renderer.setPixelRatio(Sizes.dpr);
  }

  update(e) {
    const elapsed = e;
    this.composer.render();
    // Debug.stats.update();
  }
}

export default Engine;
