(function () {
  "use strict";

  var MODES = {
    services: { heroClass: "is-agile-mode-services", gridMode: "services" },
    products: { heroClass: "is-agile-mode-products", gridMode: "products" },
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
    setMode(active ? "products" : "services");
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
      ["mouseenter", "focus", "click"].forEach(function (eventName) {
        link.addEventListener(eventName, function () {
          setMode(readModeFromLink(link));
        });
      });
    });

    syncFromActiveLink();
  }

  function ensureStaticHeroLayers(canvas) {
    if (!canvas || canvas.querySelector(".agile-hero-bg--services")) {
      return;
    }

    canvas.classList.add("agile-hero-canvas");

    var servicesBg = document.createElement("div");
    servicesBg.className =
      "agile-hero-bg agile-hero-bg--services hero-canvas__picture js-hero-posterleft";
    servicesBg.setAttribute("aria-hidden", "true");

    var productsBg = document.createElement("div");
    productsBg.className =
      "agile-hero-bg agile-hero-bg--products hero-canvas__picture js-hero-posterright";
    productsBg.setAttribute("aria-hidden", "true");

    canvas.insertBefore(servicesBg, canvas.firstChild);
    canvas.insertBefore(productsBg, canvas.firstChild.nextSibling);
  }

  function forceStaticHero() {
    document.querySelectorAll(".hero-canvas").forEach(function (canvas) {
      ensureStaticHeroLayers(canvas);
      canvas.classList.add("is-webgl-error", "agile-hero-canvas");
      canvas.classList.remove("is-webgl-init");

      canvas.querySelectorAll(".js-hero-posterleft, .js-hero-posterright").forEach(function (poster, index) {
        if (poster.classList.contains("agile-hero-bg")) {
          poster.style.opacity = index === 0 ? "1" : "0";
        }
      });

      var webglCanvas = canvas.querySelector("canvas");
      if (webglCanvas) {
        webglCanvas.style.display = "none";
      }
    });
  }

  function cleanupCustomApproachJunk() {
    document
      .querySelectorAll(
        ".agile-methodology, .agile-approach-steps, .agile-approach-visual, .agile-charts-stage"
      )
      .forEach(function (node) {
        node.remove();
      });

    document.querySelectorAll(".model-sticky").forEach(function (block) {
      block.classList.remove("agile-no-model");
    });
  }

  // Only block WebGL inside hero animals — leave ModelSticky original
  function blockHeroWebGLOnly() {
    if (window.__agileHeroWebGLBlocked) {
      return;
    }
    window.__agileHeroWebGLBlocked = true;

    if (typeof WebGLRenderingContext === "undefined") {
      return;
    }

    var OriginalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type) {
      if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
        if (this.closest && this.closest(".hero-canvas")) {
          return null;
        }
      }
      return OriginalGetContext.apply(this, arguments);
    };
  }

  function clearNowebglHash() {
    if (location.hash === "#nowebgl") {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  function ensureScrollProgress() {
    if (document.querySelector(".agile-scroll-progress")) {
      return;
    }

    var wrap = document.createElement("div");
    wrap.className = "agile-scroll-progress";
    wrap.setAttribute("aria-hidden", "true");

    var bar = document.createElement("span");
    bar.className = "agile-scroll-progress__bar";
    wrap.appendChild(bar);
    document.body.appendChild(wrap);

    function updateProgress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - window.innerHeight;
      var progress = height > 0 ? Math.min(1, scrollTop / height) : 0;
      bar.style.width = progress * 100 + "%";
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  function observeStats() {
    var numbers = document.querySelectorAll(".clients-content__number");
    if (!numbers.length || !("IntersectionObserver" in window)) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-agile-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    numbers.forEach(function (node) {
      observer.observe(node);
    });
  }

  function observeMannerLines() {
    var block = document.querySelector("[data-agile-manner]");
    if (!block) {
      return;
    }

    if (block.classList.contains("is-inview")) {
      return;
    }

    function reveal() {
      if (!block || block.classList.contains("is-inview")) {
        return true;
      }
      var rect = block.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.92 && rect.bottom > vh * 0.08) {
        block.classList.add("is-inview");
        return true;
      }
      return false;
    }

    if (reveal()) {
      return;
    }

    var ticking = false;
    function onScroll() {
      if (ticking) {
        return;
      }
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        if (reveal()) {
          window.removeEventListener("scroll", onScroll, true);
          document.removeEventListener("scroll", onScroll, true);
        }
      });
    }

    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("scroll", onScroll, true);

    [200, 600, 1200, 2000].forEach(function (ms) {
      setTimeout(function () {
        if (reveal()) {
          window.removeEventListener("scroll", onScroll, true);
          document.removeEventListener("scroll", onScroll, true);
        }
      }, ms);
    });
  }

  function prepareHeroTitleSlide() {
    var title = document.querySelector(".hero-title");
    var inner = title && title.querySelector(".js-hero-title-inner");
    if (!title || !inner) {
      return;
    }

    if (!title.classList.contains("agile-hero-title")) {
      title.classList.add("agile-hero-title");
      Array.prototype.slice.call(inner.children).forEach(function (child) {
        if (child.classList.contains("agile-slide-clip")) {
          return;
        }
        var clip = document.createElement("span");
        clip.className = "agile-slide-clip";
        inner.insertBefore(clip, child);
        clip.appendChild(child);
      });
    }

    if (title.classList.contains("is-inview")) {
      return;
    }

    // Hero is on first screen — play shortly after load so effect is visible
    function revealHero() {
      title.classList.add("is-inview");
    }

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealHero();
      return;
    }

    setTimeout(revealHero, 280);
    setTimeout(function () {
      if (!title.classList.contains("is-inview")) {
        revealHero();
      }
    }, 1200);
  }

  function init() {
    clearNowebglHash();
    blockHeroWebGLOnly();
    forceStaticHero();
    cleanupCustomApproachJunk();
    observeTitleLinks();
    ensureScrollProgress();
    observeStats();
    prepareHeroTitleSlide();
  }

  function watchHeroCanvas() {
    forceStaticHero();
    if (!("MutationObserver" in window)) {
      return;
    }
    var hero = document.querySelector(".hero");
    if (!hero || hero.dataset.agileHeroWatch === "1") {
      return;
    }
    hero.dataset.agileHeroWatch = "1";
    var timer = null;
    var observer = new MutationObserver(function () {
      if (timer) {
        return;
      }
      timer = setTimeout(function () {
        timer = null;
        forceStaticHero();
      }, 120);
    });
    observer.observe(hero, { childList: true, subtree: true, attributes: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
      watchHeroCanvas();
    });
  } else {
    init();
    watchHeroCanvas();
  }

  window.addEventListener("barba.afterEnter", function () {
    init();
    watchHeroCanvas();
  });
})();
