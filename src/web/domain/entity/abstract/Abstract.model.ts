export abstract class Abstract {

  private _key: string;

  get key(): string {
    return this._key;
  }

  set key(value: string) {
    this._key = value;
  }
}