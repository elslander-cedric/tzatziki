import * as fs from 'fs';

export class Config {

  private config : Object;

  constructor() {}

  public init() : Config {
    this.config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
    return this;
  }

  public get(name : string) : any {
    return this.config[name];
  }
}
