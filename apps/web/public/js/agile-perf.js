/**
 * Agile perf loader:
 * - resolve asset base for GitHub Pages (/Agilenew/...) and local (/)
 * - load app ASAP (required to leave Pitcher black/loading state)
 * - load Three.js only when ModelSticky exists
 * - analytics after idle
 */
(function () {
  "use strict";

  var VERSION = "v20260722";

  function jsBase() {
    var pub = document.documentElement.getAttribute("data-public-path");
    if (pub) {
      return pub.replace(/\/?$/, "/") + "js/";
    }
    // GitHub project pages: /Agilenew/...
    var parts = location.pathname.split("/").filter(Boolean);
    if (location.hostname.indexOf("github.io") !== -1 && parts.length) {
      return "/" + parts[0] + "/assets/front/build/js/";
    }
    return "/assets/front/build/js/";
  }

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
      setTimeout(fn, Math.min(timeout || 2000, 400));
    }
  }

  function bootApp() {
    var base = jsBase();
    var needThree = !!document.querySelector('[data-component="ModelSticky"]');
    var chain = [];

    // App must start quickly — otherwise Pitcher stays on a black loading screen.
    if (needThree) {
      chain.push(base + "vendor.three-addons.min.js?" + VERSION);
      chain.push(base + "vendor.three.min.js?" + VERSION);
    }
    chain.push(base + "app.min.js?" + VERSION);

    sequence(chain).catch(function (err) {
      console.warn("[agile-perf]", err);
      // Last resort: try app alone (UI without 3D)
      if (needThree) {
        loadScript(base + "app.min.js?" + VERSION).catch(function (e2) {
          console.warn("[agile-perf] app fallback failed", e2);
          document.documentElement.classList.add("is-agile-boot-failed");
        });
      } else {
        document.documentElement.classList.add("is-agile-boot-failed");
      }
    });
  }

  function deferAnalytics() {
    whenIdle(function () {
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
