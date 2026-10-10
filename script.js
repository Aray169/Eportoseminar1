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

  // 2. Menu dua tingkat: pilih semester, lalu mata kuliah semester itu
  var semTabs = Array.prototype.slice.call(document.querySelectorAll(".nav-sem a"));
  var rows = Array.prototype.slice.call(document.querySelectorAll(".nav-mk"));
  var pills = Array.prototype.slice.call(document.querySelectorAll(".nav-mk a"));
  var targets = semTabs.concat(pills);

  function showSemester(n) {
    semTabs.forEach(function (a) {
      if (a.getAttribute("data-sem") === n) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    rows.forEach(function (r) { r.hidden = r.getAttribute("data-sem") !== n; });
  }

  function setActive(id) {
    var sem = id.indexOf("s2-") === 0 || id === "semester-2" ? "2" : "1";
    showSemester(sem);
    pills.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      if (on) {
        a.setAttribute("aria-current", "true");
        var row = a.parentNode;
        row.scrollTo({ left: a.offsetLeft - (row.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  if (rows.length) showSemester("1");

  semTabs.forEach(function (a) {
    a.addEventListener("click", function () { showSemester(a.getAttribute("data-sem")); });
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-30% 0px -60% 0px" });

    targets.forEach(function (a) {
      var el = document.querySelector(a.getAttribute("href"));
      if (el) observer.observe(el);
    });
  }

  // 3. Bar progres membaca
  var bar = document.getElementById("progress-bar");
  var ticking = false;
  function updateBar() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
    if (bar) bar.style.width = pct + "%";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateBar); }
  }, { passive: true });
  updateBar();
})();
