import { Pane } from "tweakpane";

class Debug {
  constructor() {
    this.gui = new Pane({
      expanded: true,
      title: "Settings",
    });
  }
}

export default new Debug();
