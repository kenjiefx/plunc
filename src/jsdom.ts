import { JSDOM } from "jsdom";

// Setup JSDOM environment for unit tests
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
});

(global as any).window = dom.window;
(global as any).document = dom.window.document;
(global as any).HTMLElement = dom.window.HTMLElement;
(global as any).HTMLBodyElement = dom.window.HTMLBodyElement;
