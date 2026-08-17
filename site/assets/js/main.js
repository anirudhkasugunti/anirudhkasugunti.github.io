document.addEventListener("DOMContentLoaded", function () {
  // ---------- Mobile nav toggle ----------
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------- Photo carousel (About) ----------
  var carousel = document.querySelector(".photo-carousel");
  var slides = carousel ? carousel.querySelectorAll(".carousel-slide") : [];
  if (carousel && slides.length > 1) {
    var storyPhoto = carousel.closest(".story-photo");
    var dots = storyPhoto.querySelectorAll(".carousel-dot");
    var pauseBtn = storyPhoto.querySelector(".carousel-pause");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    var setDot = function (index) {
      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };
    var indexFromScroll = function () {
      var w = carousel.clientWidth || 1;
      return Math.min(Math.round(carousel.scrollLeft / w), slides.length - 1);
    };
    var goTo = function (index, smooth) {
      carousel.scrollTo({
        left: index * carousel.clientWidth,
        behavior: smooth && !reduceMotion.matches ? "smooth" : "auto"
      });
      setDot(index);
    };

    // Keep dots in sync when the user scrolls/swipes manually.
    var scrollTimer;
    carousel.addEventListener("scroll", function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () { setDot(indexFromScroll()); }, 100);
    });

    // Click a dot to jump to that photo.
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { goTo(i, true); });
    });

    // Click-and-drag with a mouse (touch/trackpad already work natively).
    var isDown = false, startX = 0, startScroll = 0, dragged = false;
    carousel.addEventListener("mousedown", function (e) {
      isDown = true;
      dragged = false;
      carousel.classList.add("is-dragging");
      startX = e.pageX;
      startScroll = carousel.scrollLeft;
    });
    window.addEventListener("mouseup", function () {
      isDown = false;
      carousel.classList.remove("is-dragging");
    });
    window.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      var delta = e.pageX - startX;
      if (Math.abs(delta) > 4) dragged = true;
      carousel.scrollLeft = startScroll - delta;
    });
    carousel.addEventListener("click", function (e) {
      if (dragged) { e.preventDefault(); e.stopPropagation(); }
    });

    // ---- Autoplay, pausable, and off under reduced-motion ----
    var timer = null;
    var userPaused = false;
    var advance = function () {
      var next = (indexFromScroll() + 1) % slides.length;
      goTo(next, next !== 0);
    };
    var startTimer = function () {
      if (timer || reduceMotion.matches || userPaused) return;
      timer = setInterval(advance, 3000);
    };
    var stopTimer = function () {
      if (timer) { clearInterval(timer); timer = null; }
    };
    var reflectState = function () {
      if (!pauseBtn) return;
      var paused = reduceMotion.matches || userPaused;
      pauseBtn.classList.toggle("is-paused", paused);
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      pauseBtn.setAttribute("aria-label", paused ? "Play the photo slideshow" : "Pause the photo slideshow");
    };

    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        if (reduceMotion.matches) return; // respect the OS preference
        userPaused = !userPaused;
        if (userPaused) stopTimer(); else startTimer();
        reflectState();
      });
    }

    // Pause when the tab is hidden; resume when it returns (unless the user paused).
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopTimer();
      else startTimer();
    });

    // React live if the user flips the OS reduced-motion setting.
    reduceMotion.addEventListener("change", function () {
      if (reduceMotion.matches) { stopTimer(); if (pauseBtn) pauseBtn.hidden = true; }
      else if (pauseBtn) { pauseBtn.hidden = false; startTimer(); }
      reflectState();
    });

    if (reduceMotion.matches) {
      if (pauseBtn) pauseBtn.hidden = true; // nothing to control — no autoplay
    } else {
      startTimer();
    }
    reflectState();
  }
});
