import { createPluncApp } from "../../../entities/plunc";
import { renderRepeats } from "../../../renders/repeat";
import { useElementSelector } from "../../../utils/elementSelector";
import { usePluncAttribute } from "../../../utils/pluncAttribute";

function run() {
  console.log("Browser compatibility tests running...");
  const testId = "repeat";
  const template = document.querySelector(
    `template[test-id="${testId}"]`
  ) as HTMLTemplateElement;
  if (!template) {
    console.error(`Template with test-id="${testId}" not found.`);
    return;
  }
  const clone = template.content.cloneNode(true) as DocumentFragment;
  const testElement = document.createElement("div");
  testElement.appendChild(clone);

  const registry = {}; // Mock registry
  const library = {}; // Mock library

  const pluncApp = createPluncApp(
    "TestApp",
    1,
    {
      prefix: "plunc-",
      startFn: async () => {
        return true;
      },
      endFn: async () => {
        /* no-op */
      },
    },
    // @ts-ignore
    registry,
    library
  );

  const attrManager = usePluncAttribute(pluncApp);
  const elementSelector = useElementSelector(testElement);

  renderRepeats(testElement, pluncApp, attrManager, elementSelector);
}

run();
