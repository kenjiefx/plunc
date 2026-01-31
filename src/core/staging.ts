import { PluncException } from "../errors/exception";
import {
  GettingInnerHtmlFromCommittedStagingElementError,
  ReCommittingStagingElementError,
  SettingInnerHtmlToCommittedStagingElementError,
} from "../errors/index";
import { StagingHTMLElement } from "../types";

export function createStagingElement(innerHtml?: string): StagingHTMLElement {
  const element = document.implementation.createHTMLDocument().body;
  // add custom property to indicate staging status
  Object.defineProperty(element, "$plStgCS", {
    value: false,
    writable: true,
    enumerable: false,
    configurable: false,
  });
  if (innerHtml) {
    element.innerHTML = innerHtml;
  }
  return element as StagingHTMLElement;
}

export function setStagingElementInnerHtml(
  stagingElement: StagingHTMLElement,
  html: string,
): void {
  if (stagingElement.$plStgCS) {
    throw new PluncException<SettingInnerHtmlToCommittedStagingElementError>(
      "ERR1",
    );
  }
  stagingElement.innerHTML = html;
}

export function getStagingElementInnerHtml(
  stagingElement: StagingHTMLElement,
): string {
  if (stagingElement.$plStgCS) {
    throw new PluncException<GettingInnerHtmlFromCommittedStagingElementError>(
      "ERR2",
    );
  }
  return stagingElement.innerHTML;
}

export function commitStagingElementTo(
  stagingElement: StagingHTMLElement,
  targetElement: HTMLElement,
): void {
  if (stagingElement.$plStgCS) {
    throw new PluncException<ReCommittingStagingElementError>("ERR3");
  }
  while (stagingElement.firstChild) {
    targetElement.appendChild(stagingElement.firstChild);
  }
  stagingElement.$plStgCS = true;
}
