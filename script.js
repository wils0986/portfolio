$(document).ready(function () {
  let skillbarsAnimated = false;
  let catAnimated = false;

  // Typing animation
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

  // Nav toggle
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

  // Dark/Light Mode Toggle
  const headerToggle = document.getElementById('lightModeToggleHeader');
  const sidebarToggle = document.getElementById('lightModeToggleSidebar');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    headerToggle.checked = true;
    sidebarToggle.checked = true;
  } else {
    document.documentElement.classList.remove('light-mode'); // default dark
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

  headerToggle.addEventListener('change', (e) => applyLightMode(e.target.checked));
  sidebarToggle.addEventListener('change', (e) => applyLightMode(e.target.checked));

  // Preload background image with Blob URL
  const aboutSection = document.querySelector(".home");
  fetch("images/yoshi.JPG")
    .then((response) => response.blob())
    .then((blob) => {
      const bgImgURL = URL.createObjectURL(blob); 
      aboutSection.style.backgroundImage = `url(${bgImgURL})`;
      aboutSection.style.backgroundRepeat = "no-repeat";
      aboutSection.classList.add("loaded");

      checkAboutSection(); 
    });

  // About section animation helpers
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
    const hash = window.location.hash.substring(1);
    if (hash === "about") {
      resetAboutAnimations();
      triggerAboutAnimations();
    }
  }

  $(window).on("hashchange", function () {
    checkAboutSection();
  });

  $(window).on("scroll", function () {
    const aboutTop = $(".home").offset().top;
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();

    if (scrollTop + windowHeight >= aboutTop + 100) {
      triggerAboutAnimations();
    }
  });

  // AJAX form
  const form = $("#ajax-contact");
  const formMessages = $("#form-messages");

  form.submit(function (e) {
    e.preventDefault();
    const formData = form.serialize();
    $.ajax({
      type: "POST",
      url: form.attr("action"),
      data: formData,
      headers: { 'Accept': 'application/json' }
    })
      .done(function (response) {
        formMessages.removeClass("error").addClass("success").text(response.message || "Thanks! Your message has been sent.");
        $("#name, #email, #message").val("");
      })
      .fail(function (data) {
        formMessages.removeClass("success").addClass("error");
        formMessages.text(data.responseText || "Oops! An error occurred and your message could not be sent.");
        console.error(data);
      });
  });

  // Paper plane animation
  document.querySelector("#submit")?.addEventListener("click", () => {
    const plane = document.querySelector("#paper-plane");
    if (plane) {
      plane.classList.remove("fly");
      void plane.offsetWidth;
      plane.classList.add("fly");
    }
  });

  // Heart pulse function
  function triggerHeartPulse() {
    const heart = document.querySelector(".pink.heart");
    if (!heart) return;
    heart.classList.remove("animate-heart");
    void heart.offsetWidth;
    heart.classList.add("animate-heart");
  }

  const btn = document.querySelector(".btn-lg");
  if (btn) btn.addEventListener("click", triggerHeartPulse);

  const heart = document.querySelector(".pink.heart");
  if (heart) heart.addEventListener("mouseenter", triggerHeartPulse);

  // Collapse mobile nav on desktop
  function collapseNavOnDesktop() {
    if (window.innerWidth > 768) {
      $(".nav-screen").css({
        right: "-285px",
        transition: "right 0.1s"
      });
      $("body").removeClass("nav-open");
    }
  }
  $(window).on("resize", collapseNavOnDesktop);
  collapseNavOnDesktop();

  // Smooth scroll for all nav links (desktop + mobile) including cross-page links
  document.querySelectorAll('.myMenu a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');

      // Same-page anchor
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          let blockValue = 'start';
          if (href === '#about' || href === '#portfolio') blockValue = 'center';
          if (href === '#contact') blockValue = 'end';
          target.scrollIntoView({ behavior: 'smooth', block: blockValue });
        }
        if ($('body').hasClass('nav-open')) {
          $('.nav-screen').animate({ right: '-285px' }, 200);
          $('body').removeClass('nav-open');
        }
      } 
      // Cross-page link to homepage anchor
      else if (href.includes('index.html#')) {
        const url = new URL(href, window.location.origin);
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
          e.preventDefault();
          const target = document.querySelector(url.hash);
          if (target) {
            let blockValue = 'start';
            if (url.hash === '#about' || url.hash === '#portfolio') blockValue = 'center';
            if (url.hash === '#contact') blockValue = 'end';
            target.scrollIntoView({ behavior: 'smooth', block: blockValue });
            if ($('body').hasClass('nav-open')) {
              $('.nav-screen').animate({ right: '-285px' }, 200);
              $('body').removeClass('nav-open');
            }
          }
        }
      }
    });
  });

  // Mobile nav special offset for portfolio
  $('.nav-screen .myMenu a[href="#portfolio"]').on('click', function(e) {
    e.preventDefault();
    const target = document.querySelector('#portfolio');
    if (!target) return;

    // Close mobile nav first
    if ($('body').hasClass('nav-open')) {
      $('.nav-screen').animate({ right: '-285px' }, 200);
      $('body').removeClass('nav-open');
    }

    // Slight delay so layout recalculates
    setTimeout(() => {
      const offset = -50; // tweak to visually center
      const top = target.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 30);
  });
});

// Portfolio Carousel
document.addEventListener("DOMContentLoaded", () => {
  const portfolioSection = document.querySelector('[data-anchor="portfolio"]');
  if (!portfolioSection) return; 

  const slidesWrapper = portfolioSection.querySelector(".content-slide");
  const slides = slidesWrapper.querySelectorAll(".slide");
  let currentIndex = 0;

  function isDesktop() {
    return window.innerWidth >= 764;
  }

  function setupCarousel() {
    if (!isDesktop()) {
      slidesWrapper.style.display = "block";
      slidesWrapper.style.overflow = "visible";
      slides.forEach(slide => {
        slide.style.display = "block";
        slide.style.width = "auto";
        slide.style.margin = "0 auto";
      });
      return;
    }

    slidesWrapper.style.display = "flex";
    slidesWrapper.style.flexDirection = "row";
    slidesWrapper.style.overflow = "hidden";
    slidesWrapper.style.width = "100%";

    slides.forEach(slide => {
      slide.style.flex = "0 0 100%";
      slide.style.maxWidth = "100%";
      slide.style.margin = "0";
    });

    showSlide(currentIndex);
  }

  function showSlide(index) {
    const slideWidth = slides[0].offsetWidth;
    slidesWrapper.scrollTo({ left: index * slideWidth, behavior: "smooth" });
  }

  function createArrows() {
    if (portfolioSection.querySelector(".prev")) return;

    const prevBtn = document.createElement("button");
    prevBtn.className = "prev";
    prevBtn.textContent = "<";

    const nextBtn = document.createElement("button");
    nextBtn.className = "next";
    nextBtn.textContent = ">";

    portfolioSection.style.position = "relative";
    portfolioSection.appendChild(prevBtn);
    portfolioSection.appendChild(nextBtn);

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });
  }

  window.addEventListener("resize", setupCarousel);

  setupCarousel();
  createArrows();
});
