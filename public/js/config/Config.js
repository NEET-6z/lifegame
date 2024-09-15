export class Config {
  constructor({ resize, editstate, mode, name}) {
    this.resize = resize || false;
    this.editstate = editstate || false;
    this.mode = mode || "free";
    this.name = name || "stage";
  }
}