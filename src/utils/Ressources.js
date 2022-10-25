import Emitter from "./Emitter";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import Sources from "./manifest";

let instance;

class Ressources {
  constructor() {
    if (instance) return instance;
    instance = this;

    this.sources = Sources;

    //Setup
    this.items = [];
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};

    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onProgress = this.loadingProgress;

    this.loaders.audioLoader = new THREE.AudioLoader(this.loadingManager);

    this.loaders.textureLoaders = new THREE.TextureLoader(this.loadingManager);
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(
      this.loadingManager
    );
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
    this.loaders.gltfLoader.setDRACOLoader(dracoLoader);
  }

  loadingProgress(url, itemsLoaded, itemsTotal) {
    Emitter.emit("loadingProgress", itemsLoaded / itemsTotal);
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "texture") {
        this.loaders.textureLoaders.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          let meshes = {};
          for (const mesh of file.scene.children) {
            meshes[mesh.name] = mesh;
          }
          this.sourceLoaded(source, meshes);
        });
      } else if (source.type === "audio") {
        this.loaders.audioLoader.load(`/sounds/${source.path}.mp3`, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;
    if (this.loaded === this.toLoad) {
      Emitter.emit("loadingReady");
    }
  }
}

export default new Ressources();
