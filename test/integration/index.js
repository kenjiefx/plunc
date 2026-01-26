const app = plunc.create("app");
app.component("FirstComponent", (LoggingService, SecondComponent) => {
  console.log("FirstComponent loaded");
  console.log({ LoggingService, SecondComponent });
  setTimeout(() => {
    LoggingService.log("FirstComponent is doing something.");
  }, 2000);
  return { data: "Hello from FirstComponent" };
});
app.component("SecondComponent", (LoggingService, $parent) => {
  console.log("SecondComponent loaded");
  setTimeout(() => {
    LoggingService.log("SecondComponent is doing something.");
    console.log($parent().data);
  }, 3000);
  return { data: "Hello from SecondComponent" };
});
app.service("LoggingService", () => {
  console.log("LoggingService initialized");
  return { log: (msg) => console.log("LOG:", msg) };
});
console.log("App initialized");
