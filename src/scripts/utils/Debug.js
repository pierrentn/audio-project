import { Pane } from "tweakpane";
import Stats from "stats.js";
import Emitter from "@js/utils/Emitter";

class Debug {
  constructor() {
    this.gui = new Pane({
      expanded: true,
      title: "Settings",
    });
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    this.setupGui();
  }

  setupGui() {
    //Tabs
    this.tabs = this.gui.addTab({
      pages: [{ title: "General" }, { title: "Parameters" }],
    });

    //Start Audio
    this.tabs.pages[0].addButton({ title: "start" }).on("click", () => {
      Emitter.emit("startAudio");
    });

    //Show Debug
    this.tabs.pages[1]
      .addButton({ title: "Show Sound Debug" })
      .on("click", () => Emitter.emit("showSoundDebug"));
  }
}

export default new Debug();
