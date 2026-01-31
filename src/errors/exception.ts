export class PluncException<TError extends string> extends Error {
  constructor(message: TError) {
    const processedMessage = `Plunc: An error has occured! Please see https://kenjiefx.github.io/plunc/errors/${message}.html for more details.`;
    super(processedMessage);
    Object.setPrototypeOf(this, Error.prototype);
  }
}
