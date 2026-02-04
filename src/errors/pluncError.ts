export class PluncError<TError extends string> extends Error {
  constructor(message: TError) {
    const processedMessage = `Plunc: An error has occured! Please see https://kenjiefx.github.io/plunc/errors/${message}.html for more details.`;
    super(processedMessage);
    Object.setPrototypeOf(this, Error.prototype);
  }
}

export type SettingInnerHtmlToCommittedStagingElementError = "ERR1";
export type GettingInnerHtmlFromCommittedStagingElementError = "ERR2";
export type ReCommittingStagingElementError = "ERR3";
export type InvalidLibrarySourceError = "ERR4";
export type InvalidComponentFamilyTreeSourceError = "ERR5";
export type InvalidRegistrySourceError = "ERR6";
export type MissingLiveAppRootElementError = "ERR7";
export type UsingBlockAPIOutsideAppReadyError = "ERR8";
export type MissingLiveComponentElementError = "ERR9";
export type UsingPatchAPIOutsideAppReadyError = "ERR10";
export type MissingBlockElementInComponentError = "ERR11";
export type UsingThisAPIOutsideAppReadyError = "ERR12";
