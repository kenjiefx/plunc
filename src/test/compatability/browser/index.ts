import { createPluncApp } from "../../../entities/plunc";
import { renderRepeats } from "../../../renders/repeat";
import { useElementSelector } from "../../../utils/elementSelector";
import { usePluncAttributeFormatter } from "../../../utils/pluncAttribute";

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

  const attrFormatter = usePluncAttributeFormatter(pluncApp);
  renderRepeats(clone, attrFormatter, useElementSelector(), {
    items: [
      {
        name: "Item 1",
        subItems: [
          {
            title: "SubItem 1-1",
            subSubItems: [
              { detail: "Detail 1-1-1" },
              { detail: "Detail 1-1-2" },
            ],
          },
          {
            title: "SubItem 1-2",
            subSubItems: [{ detail: "Detail 1-2-1" }],
          },
        ],
      },
      {
        name: "Item 2",
        subItems: [
          {
            title: "SubItem 2-1",
            subSubItems: [{ detail: "Detail 2-1-1" }],
          },
        ],
      },
      {
        name: "Item 3",
        subItems: [],
      },
    ],
    notes: [{ id: "Note1" }, { id: "Note2" }],
  });
}

run();
