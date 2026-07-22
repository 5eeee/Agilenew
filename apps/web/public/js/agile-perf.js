/**
 * Agile perf loader — works on local (/) and GitHub Pages (/Agilenew/).
 */
(function () {
  "use strict";

  var VERSION = "v20260722r";

  function siteRoot() {
    var pub = document.documentElement.getAttribute("data-public-path") || "";
    // data-public-path like "/Agilenew/assets/front/build/" or "/assets/front/build/"
    var m = pub.match(/^(.*?)\/assets\/front\/build\/?$/);
    if (m) {
      return m[1] || "";
    }
    if (location.hostname.indexOf("github.io") !== -1) {
      var parts = location.pathname.split("/").filter(Boolean);
      if (parts.length) {
        return "/" + parts[0];
      }
    }
    return "";
  }

  function jsBase() {
    return siteRoot() + "/assets/front/build/js/";
  }

  function revealPage() {
    document.documentElement.classList.add("is-agile-ready");
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      var s = document.createElement("script");
      s.src = src;
      s.defer = true;
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

  function bootApp() {
    var base = jsBase();
    var needThree = !!document.querySelector('[data-component="ModelSticky"]');
    var chain = [];

    if (needThree) {
      chain.push(base + "vendor.three-addons.min.js?" + VERSION);
      chain.push(base + "vendor.three.min.js?" + VERSION);
    }
    chain.push(base + "app.min.js?" + VERSION);

    // Always reveal UI quickly — Pitcher otherwise can sit on a black hero.
    setTimeout(revealPage, 600);
    setTimeout(revealPage, 2000);

    sequence(chain)
      .then(function () {
        revealPage();
      })
      .catch(function (err) {
        console.warn("[agile-perf]", err, "base=", base);
        // Try app without Three
        loadScript(base + "app.min.js?" + VERSION)
          .then(revealPage)
          .catch(function () {
            document.documentElement.classList.add("is-agile-boot-failed");
            revealPage();
          });
      });
  }

  if (location.hostname.indexOf("github.io") !== -1) {
    document.documentElement.classList.add("is-agile-pages");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootApp);
  } else {
    bootApp();
  }
})();
