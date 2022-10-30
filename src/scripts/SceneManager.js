import { Scene } from "three";
import Terrain from "@js/scene/Terrain";
import Cube from "@js/scene/Cube";
import Sky from "@js/scene/Sky";
import TransitionCamera from "@js/scene/TransitionCamera";

class SceneManager extends Scene {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.terrain = new Terrain(this);
    this.cube = new Cube(this);
    this.sky = new Sky(this);
    //TODO: Replace with custom post-pro effect
    this.transitionCamera = new TransitionCamera(this);
  }
}

export default new SceneManager();
