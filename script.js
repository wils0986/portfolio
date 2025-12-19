$(document).ready(function () {
  let skillbarsAnimated = false;
  let catAnimated = false;

  /* ===============================
     Typing animation
  =============================== */
  (function ($) {
    if (!$.fn.writeText) {
      $.fn.writeText = function (content, speed = 100) {
        const elem = this;
        let current = 0;
        elem.html('<span class="typed-text"></span>');
        const textSpan = elem.find(".typed-text");

        function type() {
          if (current < content.length) {
            textSpan.append(content[current++]);
            setTimeout(type, speed);
          } else {
            textSpan.addClass('cursor');
          }
        }
        type();
      };
    }
  })(jQuery);

  setTimeout(() => {
    $("p.holder").css("visibility", "visible");
    $("#holder").writeText("Digital Experience Designer", 130);
  }, 2500);

  new WOW().init();

  /* ===============================
     Nav toggle
  =============================== */
  function main() {
    $(".fa-bars").click(function () {
      $(".nav-screen").animate({ right: "0px" }, 200);
      $("body").animate({ right: "285px" }, 200).addClass("nav-open");
    });

    $(".fa-times, .nav-links a").click(function () {
      $(".nav-screen").animate({ right: "-285px" }, 200);
      $("body").animate({ right: "0px" }, 200).removeClass("nav-open");
    });
  }
  main();

  /* ===============================
     Dark / Light mode
  =============================== */
  const headerToggle = document.getElementById('lightModeToggleHeader');
  const sidebarToggle = document.getElementById('lightModeToggleSidebar');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    headerToggle.checked = true;
    sidebarToggle.checked = true;
  } else {
    document.documentElement.classList.remove('light-mode');
    headerToggle.checked = false;
    sidebarToggle.checked = false;
  }

  function applyLightMode(isLight) {
    if (isLight) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }

  headerToggle?.addEventListener('change', e => applyLightMode(e.target.checked));
  sidebarToggle?.addEventListener('change', e => applyLightMode(e.target.checked));

  /* ===============================
     Background image preload (Blob)
  =============================== */
  const aboutSection = document.querySelector(".home");
  if (aboutSection) {
    const img = new Image();
    img.src = "images/yoshi.JPG";
    img.onload = () => {
      fetch("images/yoshi.JPG")
        .then(res => res.blob())
        .then(blob => {
          const bgImgURL = URL.createObjectURL(blob);
          aboutSection.style.backgroundImage = `url(${bgImgURL})`;
          aboutSection.classList.add("loaded");
          checkAboutSection();
        });
    };
  }

  /* ===============================
     About section animations
  =============================== */
  function triggerAboutAnimations() {
    if (!skillbarsAnimated) {
      $(".skillbar").each(function () {
        const percent = $(this).attr("data-percent");
        $(this).find(".skillbar-bar").animate({ width: percent }, 50);
      });
      $(".cat").addClass("slide-in");
      skillbarsAnimated = true;
      catAnimated = true;
    }
  }

  function resetAboutAnimations() {
    skillbarsAnimated = false;
    catAnimated = false;
    $(".skillbar-bar").css("width", "0");
    $(".cat").removeClass("slide-in");
  }

  function checkAboutSection() {
    if (window.location.hash === "#about") {
      resetAboutAnimations();
      triggerAboutAnimations();
    }
  }

  $(window).on("hashchange", checkAboutSection);

  $(window).on("scroll", function () {
    const aboutTop = $(".home").offset()?.top || 0;
    if ($(window).scrollTop() + $(window).height() >= aboutTop + 100) {
      triggerAboutAnimations();
    }
  });

  /* ===============================
     AJAX contact form
  =============================== */
  const form = $("#ajax-contact");
  const formMessages = $("#form-messages");

  form.submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: form.attr("action"),
      data: form.serialize(),
      headers: { Accept: "application/json" }
    })
      .done(res => {
        formMessages.removeClass("error").addClass("success")
          .text(res.message || "Thanks! Your message has been sent.");
        form[0].reset();
      })
      .fail(err => {
        formMessages.removeClass("success").addClass("error")
          .text("Oops! Something went wrong.");
        console.error(err);
      });
  });

  /* ===============================
     Anchor scroll helper (FIX)
  =============================== */
  function scrollToAnchorWithOffset(hash) {
    const target = document.querySelector(hash);
    if (!target) return;

    let offset = 0;

    if (hash === "#portfolio") {
      offset = window.innerWidth <= 768 ? 30 : 10;
    }
    if (hash === "#about") {
      offset = window.innerWidth <= 768 ? -10 : 0;
    }

    const top =
      target.getBoundingClientRect().top +
      window.pageYOffset +
      offset;

    window.scrollTo({ top, behavior: "smooth" });
  }

  /* ===============================
     Nav link handling (index + projects)
  =============================== */
  document.querySelectorAll('.myMenu a, .header-links a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.includes('#')) return;

      const [path, hash] = href.split('#');
      const targetHash = `#${hash}`;

      // Same page
      if (!path || window.location.pathname.endsWith(path)) {
        e.preventDefault();
        scrollToAnchorWithOffset(targetHash);
      }

      // Cross-page (project → index)
      else if (path.includes('index.html')) {
        e.preventDefault();
        sessionStorage.setItem('scrollTarget', targetHash);
        window.location.href = 'index.html';
      }

      if ($('body').hasClass('nav-open')) {
        $('.nav-screen').animate({ right: '-285px' }, 200);
        $('body').removeClass('nav-open');
      }
    });
  });

  /* ===============================
     Apply stored anchor after load
  =============================== */
  const storedTarget = sessionStorage.getItem('scrollTarget');
  if (storedTarget) {
    sessionStorage.removeItem('scrollTarget');
    setTimeout(() => scrollToAnchorWithOffset(storedTarget), 100);
  }

  /* ===============================
     Collapse mobile nav on desktop
  =============================== */
  function collapseNavOnDesktop() {
    if (window.innerWidth > 768) {
      $(".nav-screen").css({ right: "-285px" });
      $("body").removeClass("nav-open");
    }
  }
  $(window).on("resize", collapseNavOnDesktop);
  collapseNavOnDesktop();
});

/* ===============================
   Portfolio carousel
=============================== */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector('[data-anchor="portfolio"]');
  if (!section) return;

  const wrapper = section.querySelector(".content-slide");
  const slides = wrapper.querySelectorAll(".slide");
  let index = 0;

  function isDesktop() {
    return window.innerWidth >= 764;
  }

  function setup() {
    if (!isDesktop()) {
      wrapper.style.display = "block";
      wrapper.style.overflow = "visible";
      return;
    }

    wrapper.style.display = "flex";
    wrapper.style.overflow = "hidden";
    slides.forEach(s => s.style.flex = "0 0 100%");
    show(index);
  }

  function show(i) {
    wrapper.scrollTo({ left: i * slides[0].offsetWidth, behavior: "smooth" });
  }

  function arrows() {
    if (section.querySelector(".prev")) return;

    const prev = document.createElement("button");
    const next = document.createElement("button");
    prev.className = "prev";
    next.className = "next";
    prev.textContent = "<";
    next.textContent = ">";

    section.append(prev, next);

    prev.onclick = () => show(index = (index - 1 + slides.length) % slides.length);
    next.onclick = () => show(index = (index + 1) % slides.length);
  }

  window.addEventListener("resize", setup);
  setup();
  arrows();
});
