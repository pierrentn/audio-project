import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  ShaderMaterial,
  SphereGeometry,
  MeshPhysicalMaterial,
  WebGLRenderer,
  TextureLoader,
  DirectionalLight,
  Vector2,
  AmbientLight,
  DirectionalLightHelper,
  MeshStandardMaterial,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Sizes from "./utils/Sizes";
import Debug from "./utils/Debug";
import Emitter from "./utils/Emitter";
import Terrain from "./Terrain";
import Cube from "./Cube";

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
  }
  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupScene();
  }

  setupCamera() {
    this.camera = new PerspectiveCamera(
      75,
      Sizes.width / Sizes.height,
      0.01,
      1000
    );
    this.camera.position.z = 10;
    this.camera.position.y = 5;
    console.log(this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.scene.add(this.camera);
  }

  setupRenderer() {
    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(Sizes.width, Sizes.height);
    this.renderer.setPixelRatio(Sizes.dpr);

    document.body.appendChild(this.renderer.domElement);
  }

  setupScene() {
    const ambientLight = new AmbientLight(0xeeeeee, 0);
    // this.scene.add(ambientLight);

    const dirLight = new DirectionalLight({
      color: 0xffffff,
      intensity: 1,
    });
    dirLight.position.set(-3, 5, 0);
    // dirLight.rotation.z = Math.PI / 2;
    this.scene.add(dirLight);
    this.scene.add(new DirectionalLightHelper(dirLight));

    this.terrain = new Terrain(this.scene);
    this.cube = new Cube(this.scene);
    // this.scene.add(
    //   new Mesh(new BoxGeometry(5, 5, 5), new MeshStandardMaterial())
    // );
  }

  onResize() {
    // Update Camera
    this.camera.aspect = Sizes.width / Sizes.height;
    this.camera.updateProjectionMatrix();
    //update renderer
    this.renderer.setSize(Sizes.width, Sizes.height);
    this.renderer.setPixelRatio(Sizes.dpr);
  }

  update(e) {
    const elapsed = e;
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  }
}

export default Engine;
