document.addEventListener("DOMContentLoaded", function () {
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

  var carousel = document.querySelector(".photo-carousel");
  var slides = carousel ? carousel.querySelectorAll(".carousel-slide") : [];
  if (carousel && slides.length > 1) {
    var dots = carousel.closest(".story-photo").querySelectorAll(".carousel-dot");
    var setDot = function (index) {
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    };
    var indexFromScroll = function () {
      var w = carousel.clientWidth || 1;
      return Math.min(Math.round(carousel.scrollLeft / w), slides.length - 1);
    };

    // Keep dots in sync when the user manually scrolls/swipes.
    var scrollTimer;
    carousel.addEventListener("scroll", function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        setDot(indexFromScroll());
      }, 100);
    });

    // Allow click-and-drag scrolling with a mouse (touch/trackpad already work natively).
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

    setInterval(function () {
      var next = (indexFromScroll() + 1) % slides.length;
      carousel.scrollTo({
        left: next * carousel.clientWidth,
        behavior: next === 0 ? "auto" : "smooth"
      });
      setDot(next);
    }, 3000);
  }
});
