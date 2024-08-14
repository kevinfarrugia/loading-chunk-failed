import { Workbox } from "workbox-window";

document.getElementById("btn").addEventListener("click", async () => {
  const { myFunction } = await import(
    /* webpackChunkName: "Chunk" */ "./chunk.js"
  );
  myFunction();
});

const promptForUpdate = async () => {
  // This is where you'd put code to show the UI prompt.
  return confirm("New version available. Refresh now?");
};

if ("serviceWorker" in navigator) {
  const wb = new Workbox("/sw.js");

  const showSkipWaitingPrompt = async (event) => {
    if (event.wasWaitingBeforeRegister) {
      // `event.wasWaitingBeforeRegister` will be false if this is
      // the first time the updated service worker is waiting.
    }

    // refresh the page as soon as the service worker has taken control
    wb.addEventListener("controlling", () => {
      window.location.reload();
    });

    // prompt the user to update to the latest version
    const updateAccepted = await promptForUpdate();

    // send SKIP_WAITING message to the service worker
    if (updateAccepted) {
      wb.messageSkipWaiting();
    }
  };

  // Add an event listener to detect when the registered
  // service worker has installed but is waiting to activate.
  wb.addEventListener("waiting", (event) => {
    console.log(event);
    showSkipWaitingPrompt(event);
  });

  wb.register();

  // Add an event listener to detect when the page has become visible again.
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      wb.update();
    }
  });
}
