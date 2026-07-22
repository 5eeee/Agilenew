/**
 * Agile perf loader:
 * - defer Three.js (~630KB) + app until idle / near ModelSticky
 * - skip Three entirely on pages without ModelSticky
 * - load analytics after idle
 */
(function () {
  "use strict";

  var VERSION = "v20260722";
  var BASE = "/assets/front/build/js/";

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        reject(new Error("Failed: " + src));
      };
      document.body.appendChild(s);
    });
  }

  function sequence(urls) {
    return urls.reduce(function (chain, url) {
      return chain.then(function () {
        return loadScript(url);
      });
    }, Promise.resolve());
  }

  function whenIdle(fn, timeout) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(fn, { timeout: timeout || 2000 });
    } else {
      setTimeout(fn, Math.min(timeout || 2000, 1200));
    }
  }

  function nearModelSticky(cb) {
    var el = document.querySelector('[data-component="ModelSticky"]');
    if (!el) {
      cb(false);
      return;
    }
    if (!("IntersectionObserver" in window)) {
      cb(true);
      return;
    }
    var done = false;
    var io = new IntersectionObserver(
      function (entries) {
        if (done) return;
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting || entries[i].intersectionRatio > 0) {
            done = true;
            io.disconnect();
            cb(true);
            return;
          }
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    // Fallback: still load after a while so 3D appears without scroll
    setTimeout(function () {
      if (!done) {
        done = true;
        io.disconnect();
        cb(true);
      }
    }, 2500);
  }

  function bootApp() {
    var needThree = !!document.querySelector('[data-component="ModelSticky"]');
    var chain = [];

    function startHeavy() {
      if (needThree) {
        chain.push(BASE + "vendor.three-addons.min.js?" + VERSION);
        chain.push(BASE + "vendor.three.min.js?" + VERSION);
      }
      chain.push(BASE + "app.min.js?" + VERSION);
      sequence(chain).catch(function (err) {
        console.warn("[agile-perf]", err);
      });
    }

    if (!needThree) {
      // Pages without 3D: bring app in quickly after first paint
      whenIdle(startHeavy, 400);
      return;
    }

    // Homepage: delay Three (~630KB) until sticky is near, with short fallback
    nearModelSticky(function () {
      whenIdle(startHeavy, 600);
    });
  }

  function deferAnalytics() {
    whenIdle(function () {
      // Yandex Metrika (lightweight init, no webvisor)
      (function (m, e, t, r, i, k, a) {
        m[i] =
          m[i] ||
          function () {
            (m[i].a = m[i].a || []).push(arguments);
          };
        m[i].l = 1 * new Date();
        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = 1;
        k.src = r;
        a.parentNode.insertBefore(k, a);
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      if (typeof ym === "function") {
        ym(51148418, "init", {
          clickmap: false,
          trackLinks: false,
          accurateTrackBounce: true,
          webvisor: false,
        });
      }
    }, 5000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bootApp();
      deferAnalytics();
    });
  } else {
    bootApp();
    deferAnalytics();
  }
})();
