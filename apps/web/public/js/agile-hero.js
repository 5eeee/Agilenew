(function () {
  "use strict";

  var MODES = {
    services: {
      heroClass: "is-agile-mode-services",
      gridMode: "services",
    },
    products: {
      heroClass: "is-agile-mode-products",
      gridMode: "products",
    },
  };

  function getHero() {
    return document.querySelector(".hero");
  }

  function getWorksGrid() {
    return document.querySelector(".works-grid");
  }

  function setMode(mode) {
    var config = MODES[mode] || MODES.services;
    var hero = getHero();
    var grid = getWorksGrid();

    if (hero) {
      hero.classList.remove("is-agile-mode-services", "is-agile-mode-products");
      hero.classList.add(config.heroClass);
    }

    if (grid) {
      grid.setAttribute("data-agile-mode", config.gridMode);
    }
  }

  function readModeFromLink(link) {
    return link && link.getAttribute("data-agile-mode") === "products" ? "products" : "services";
  }

  function syncFromActiveLink() {
    var active = document.querySelector(".js-hero-title-linkright.active");
    if (active) {
      setMode("products");
      return;
    }

    setMode("services");
  }

  function observeTitleLinks() {
    var left = document.querySelector(".js-hero-title-linkleft");
    var right = document.querySelector(".js-hero-title-linkright");

    if (!left || !right) {
      return;
    }

    var observer = new MutationObserver(syncFromActiveLink);
    observer.observe(left, { attributes: true, attributeFilter: ["class"] });
    observer.observe(right, { attributes: true, attributeFilter: ["class"] });

    [left, right].forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        setMode(readModeFromLink(link));
      });
      link.addEventListener("focus", function () {
        setMode(readModeFromLink(link));
      });
      link.addEventListener("click", function () {
        setMode(readModeFromLink(link));
      });
    });

    syncFromActiveLink();
  }

  function forceStaticHero() {
    var canvas = document.querySelector(".agile-hero-canvas");
    if (!canvas) {
      return;
    }

    canvas.classList.add("is-webgl-error");
    canvas.classList.remove("is-webgl-init");

    var posters = canvas.querySelectorAll(".js-hero-posterleft, .js-hero-posterright");
    posters.forEach(function (poster, index) {
      poster.style.opacity = index === 0 ? "1" : "0";
    });
  }

  function init() {
    forceStaticHero();
    observeTitleLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("barba.afterEnter", init);
})();
