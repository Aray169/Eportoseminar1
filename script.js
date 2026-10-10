// E-Portofolio Refleksi LK 2 - Ariesta Vandera
(function () {
  "use strict";

  // 1. Tema terang/gelap (disimpan di localStorage)
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");

  function safeGet() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  function safeSet(v) {
    try { localStorage.setItem("theme", v); } catch (e) {}
  }
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var saved = safeGet();
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

  if (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      safeSet(next);
    });
  }

  // 2. Menu navigasi aktif sesuai bagian yang sedang dibaca
  var links = Array.prototype.slice.call(document.querySelectorAll("nav a[href^='#']"));
  var sections = links.map(function (a) {
    return document.querySelector(a.getAttribute("href"));
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          var active = a.getAttribute("href") === "#" + entry.target.id;
          if (active) {
            a.setAttribute("aria-current", "true");
            var bar = a.parentNode;
            bar.scrollTo({ left: a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
          } else {
            a.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });

    sections.forEach(function (s) { if (s) observer.observe(s); });
  }
})();
