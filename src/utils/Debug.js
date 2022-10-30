import { Pane } from "tweakpane";
import Stats from "stats.js";

class Debug {
  constructor() {
    this.gui = new Pane({
      expanded: true,
      title: "Settings",
    });
    this.stats = new Stats();
    // document.body.appendChild(this.stats.dom);
  }
}

export default new Debug();
