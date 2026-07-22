/**
 * Agile loader.
 * On GitHub Pages: do NOT boot Pitcher app/Three (they leave a black screen
 * under /Agilenew/). Show static HTML+CSS only.
 * Locally: load Three (if needed) + app.min.js as before.
 */
(function () {
  "use strict";

  var VERSION = "v20260722s";
  var isPages = location.hostname.indexOf("github.io") !== -1;

  function revealPage() {
    document.documentElement.classList.add("is-agile-ready", "is-agile-static");
    document.querySelectorAll(".hero-title").forEach(function (el) {
      el.classList.add("is-inview", "agile-hero-title");
    });
  }

  function siteRoot() {
    var pub = document.documentElement.getAttribute("data-public-path") || "";
    var m = pub.match(/^(.*?)\/assets\/front\/build\/?$/);
    if (m) return m[1] || "";
    if (isPages) {
      var parts = location.pathname.split("/").filter(Boolean);
      if (parts.length) return "/" + parts[0];
    }
    return "";
  }

  function jsBase() {
    return siteRoot() + "/assets/front/build/js/";
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
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

  function bootLocal() {
    var base = jsBase();
    var needThree = !!document.querySelector('[data-component="ModelSticky"]');
    var chain = [];
    if (needThree) {
      chain.push(base + "vendor.three-addons.min.js?" + VERSION);
      chain.push(base + "vendor.three.min.js?" + VERSION);
    }
    chain.push(base + "app.min.js?" + VERSION);
    setTimeout(revealPage, 800);
    sequence(chain).then(revealPage).catch(function (err) {
      console.warn("[agile-perf]", err);
      document.documentElement.classList.add("is-agile-boot-failed");
      revealPage();
    });
  }

  function stripPitcherRuntime() {
    // Stop already-deferred Pitcher vendors from doing anything harmful if possible
    document.documentElement.classList.add("is-agile-pages", "no-js");
    document.documentElement.classList.remove("js");
    // Hide canvases that paint black full-bleed
    document.querySelectorAll(".hero-canvas canvas, canvas").forEach(function (c) {
      c.style.display = "none";
    });
    revealPage();
  }

  if (isPages) {
    document.documentElement.classList.add("is-agile-pages");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", stripPitcherRuntime);
    } else {
      stripPitcherRuntime();
    }
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootLocal);
  } else {
    bootLocal();
  }
})();
