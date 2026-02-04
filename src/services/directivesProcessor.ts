import { PluncAppContainer } from "../container";
import { composeCheckDirectiveProcessor } from "../directives/check";
import { composeConditionalDirectivesProcessor } from "../directives/conditionals";
import { composeDisableDirectiveProcessor } from "../directives/disable";
import { composeEventDirectiveProcessor } from "../directives/events";
import { composeModelDirectiveProcessor } from "../directives/model";
import { composePlaceholderResolver } from "../directives/placeholders";
import { composeRepeatDirectiveProcessor } from "../directives/repeat";
import { composeStyleDirectiveProcessor } from "../directives/style";

export type DirectivesProcessor = (
  targetElement: HTMLElement,
  dataCtx: { [key: string]: unknown },
  skipEventProcessing?: boolean,
) => void;

export function composeDirectivesProcessor(appCtx: PluncAppContainer) {
  const processRepeat = composeRepeatDirectiveProcessor(appCtx);
  const processCheck = composeCheckDirectiveProcessor(appCtx);
  const processConditionals = composeConditionalDirectivesProcessor(appCtx);
  const processDisable = composeDisableDirectiveProcessor(appCtx);
  const processEvents = composeEventDirectiveProcessor(appCtx);
  const processModels = composeModelDirectiveProcessor(appCtx);
  const resolvePlaceholders = composePlaceholderResolver(appCtx);
  const processStyles = composeStyleDirectiveProcessor(appCtx);
  function processDirectives(
    targetElement: HTMLElement,
    dataCtx: { [key: string]: unknown },
    skipEventProcessing: boolean = true,
  ) {
    // Process repeat directive first
    processRepeat(targetElement, dataCtx, processDirectives);
    processConditionals(targetElement, dataCtx);
    resolvePlaceholders(targetElement, dataCtx);
    processCheck(targetElement, dataCtx);
    processStyles(targetElement, dataCtx);
    processModels(targetElement, dataCtx);
    processDisable(targetElement, dataCtx);
    if (skipEventProcessing === false) {
      processEvents(targetElement, dataCtx);
    }
  }

  return processDirectives;
}
