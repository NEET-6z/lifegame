export class Config {
  constructor({ mode, name}) {
    this.resize = mode=='free';
    this.editstate = mode=='free';
    this.mode = mode || "free";
    this.name = name || "";
  }
}