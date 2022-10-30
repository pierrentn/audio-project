import { WebGLRenderer } from "three";
import * as POSTPROCESSING from "postprocessing";
import { SSREffect, defaultSSROptions } from "screen-space-reflections";
import { SSRDebugGUI } from "@js/utils/SSRDebugGUI";
import Sizes from "@js/utils/Sizes";
import Debug from "@js/utils/Debug";
import Emitter from "@js/utils/Emitter";
import Scene from "@js/SceneManager";
import CameraManager from "@js/CameraManager";
import AudioManager from "./AudioManager";

class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.camera = new CameraManager().camera;

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
        fade: 4.7,
        thickness: 3.5,
        ior: 1.75,
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
        intensity: 0.7,
      },
    };

    this.init();

    Emitter.on("tick", (e) => this.update(e));
    Emitter.on("resize", () => this.onResize());
    Emitter.on("cameraHidden", () => this.onCameraHidden());
    Emitter.on("showCamera", () => this.onCamSwitch());
  }

  init() {
    this.setupCanvas();
    this.setupRenderer();
    this.setupPostProcessing();
  }

  setupCanvas() {
    this.canvas.style.width = Sizes.width;
    this.canvas.style.height = Sizes.height;
    this.canvas.width = Sizes.width * Sizes.dpr;
    this.canvas.height = Sizes.height * Sizes.dpr;
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
    this.composer = new POSTPROCESSING.EffectComposer(this.renderer);

    this.effect = {};

    this.effect.ssr = new SSREffect(Scene, this.camera);

    const ssrSelection = new POSTPROCESSING.Selection([
      Scene.children[0],
      Scene.children[1],
      Scene.children[2],
      Scene.children[3],
    ]);
    console.log(Scene.children);
    this.effect.ssr.selection = ssrSelection;

    this.effect.bloom = new POSTPROCESSING.SelectiveBloomEffect(
      Scene,
      this.camera,
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
    // this.passes.cameraTransition = new POSTPROCESSING.MaskPass(
    //   Scene,
    //   this.camera
    // );

    this.passes.render = new POSTPROCESSING.RenderPass(Scene, this.camera);

    this.passes.ssr = new POSTPROCESSING.EffectPass(
      this.camera,
      this.effect.ssr
    );

    this.passes.bloom = new POSTPROCESSING.EffectPass(
      this.camera,
      this.effect.bloom
    );

    this.composer.addPass(this.passes.render);
    this.composer.addPass(this.passes.ssr);
    this.composer.addPass(this.passes.bloom);

    // this.ssrGui = new SSRDebugGUI(
    //   this.effect.ssr,
    //   Debug.gui,
    //   this.postParams.ssrOpt
    // );
  }

  onCameraHidden() {
    this.composer.removeAllPasses();
  }

  onCamSwitch() {
    this.camera = new CameraManager().camera;
    this.setupPostProcessing();
  }

  onResize() {
    this.renderer.setSize(Sizes.width, Sizes.height);
    this.renderer.setPixelRatio(Sizes.dpr);
  }

  update(e) {
    const elapsed = e;

    // this.effect.bloom.intensity =
    //   this.postParams.bloomOpt.intensity + AudioManager.values[0];
    this.composer.render();
    // this.renderer.render(Scene, this.camera);
    Debug.stats.update();
  }
}

export default Engine;
