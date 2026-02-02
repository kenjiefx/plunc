// Everything that has to do with properly supporting our document ready event.
// Brought over from the most awesome jQuery. Please note that this code is
// littered with ts-ignore comments to suppress TypeScript errors due to the
// dynamic nature of the code. These are intentional and will be removed in
// future versions when we can properly type everything.
const userAgent = navigator.userAgent.toLowerCase();

// Figure out what browser is being used
const browser = {
  version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
  safari: /webkit/.test(userAgent),
  opera: /opera/.test(userAgent),
  msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
  mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
};

let readyBound = false;
let isReady = false;
let readyList: Array<() => any> = [];

// Handle when the DOM is ready
function domReady() {
  // Make sure that the DOM is not already loaded
  if (!isReady) {
    // Remember that the DOM is ready
    isReady = true;
    if (readyList) {
      for (var fn = 0; fn < readyList.length; fn++) {
        // @ts-ignore
        readyList[fn].call(window, []);
      }
      readyList = [];
    }
  }
}

// From Simon Willison. A safe way to fire onload w/o screwing up everyone else.
// @ts-ignore
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != "function") {
    window.onload = func;
  } else {
    window.onload = function () {
      // @ts-ignore
      if (oldonload) oldonload();
      func();
    };
  }
}

// does the heavy work of working through the browsers idiosyncracies (let's call them that) to hook onload.
function bindReady() {
  if (readyBound) {
    return;
  }

  readyBound = true;

  // Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
  if (document.addEventListener && !browser.opera) {
    // Use the handy event callback
    document.addEventListener("DOMContentLoaded", domReady, false);
  }

  // If IE is used and is not in a frame
  // Continually check to see if the document is ready
  if (browser.msie && window == top)
    (function checkReady() {
      if (isReady) return;
      try {
        // If IE is used, use the trick by Diego Perini
        // http://javascript.nwbox.com/IEContentLoaded/
        // @ts-ignore
        document.documentElement.doScroll("left");
      } catch (error) {
        setTimeout(checkReady, 0);
        return;
      }
      // and execute any waiting functions
      domReady();
    })();

  if (browser.opera) {
    document.addEventListener(
      "DOMContentLoaded",
      function checkReady() {
        if (isReady) return;
        for (var i = 0; i < document.styleSheets.length; i++)
          if (document.styleSheets[i].disabled) {
            setTimeout(checkReady, 0);
            return;
          }
        // and execute any waiting functions
        domReady();
      },
      false,
    );
  }

  if (browser.safari) {
    var numStyles;
    (function checkReady() {
      if (isReady) return;
      if (
        // @ts-ignore
        document.readyState != "loaded" &&
        document.readyState != "complete"
      ) {
        setTimeout(checkReady, 0);
        return;
      }
      if (numStyles === undefined) {
        var links = document.getElementsByTagName("link");
        for (var i = 0; i < links.length; i++) {
          if (links[i].getAttribute("rel") == "stylesheet") {
            // @ts-ignore
            numStyles++;
          }
        }
        var styles = document.getElementsByTagName("style");
        // @ts-ignore
        numStyles += styles.length;
      }
      if (document.styleSheets.length != numStyles) {
        setTimeout(checkReady, 0);
        return;
      }

      // and execute any waiting functions
      domReady();
    })();
  }

  // A fallback to window.onload, that will always work
  addLoadEvent(domReady);
}

// This is the public function that people can use to hook up ready.
export const DOMHelper = {
  ready: function (callback: () => void) {
    // Attach the listeners
    bindReady();

    // If the DOM is already ready, then execute the function immediately
    // @ts-ignore
    if (isReady) return callback.call(window, []);

    // Otherwis, add  the function to the wait list
    readyList.push(function () {
      // @ts-ignore
      return callback.call(window, []);
    });
  },
};

bindReady();
