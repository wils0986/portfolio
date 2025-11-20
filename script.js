/* jshint esversion: 11 */
/* global $, jQuery, WOW, fullpage, fullpage_api */

$(document).ready(function () {
  initFullPage();
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
    $("#holder").writeText("Multimedia Designer and Communications Specialist", 130);
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

  // --- Dark Mode Toggle ---
  const headerToggle = document.getElementById('darkModeToggleHeader');
  const sidebarToggle = document.getElementById('darkModeToggleSidebar');

  function applyDarkMode(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      headerToggle.checked = true;
      sidebarToggle.checked = true;
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      headerToggle.checked = false;
      sidebarToggle.checked = false;
      localStorage.setItem('theme', 'light');
    }
  }

  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    applyDarkMode(true);
  }

  // Event listeners for toggles
  headerToggle.addEventListener('change', (e) => applyDarkMode(e.target.checked));
  sidebarToggle.addEventListener('change', (e) => applyDarkMode(e.target.checked));

  // Preload background image
  const aboutSection = document.querySelector(".aboutme");
  const bgImg = new Image();
  bgImg.src = "images/yoshi.JPG";

  bgImg.onload = function () {
    aboutSection.style.paddingTop = "58px";
    aboutSection.style.backgroundImage = `url(${bgImg.src})`;
    aboutSection.style.backgroundSize = "contain";
    aboutSection.style.backgroundPosition = "center top";
    aboutSection.style.backgroundRepeat = "no-repeat";
    aboutSection.classList.add("loaded");

    checkAboutSection(); // trigger animation if hash is already #about on load
  };

  // --- About section animation helpers ---
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

  // --- FullPage initialization ---
  function initFullPage() {
    const isMobile = window.innerWidth <= 768;

    new fullpage("#fullpage", {
      licenseKey: "5N17I-P8UU6-KQ9ZH-EZJ08-UJLLN",
      scrollBar: true,
      responsiveWidth: 768,
      navigation: true,
      navigationTooltips: ["Home", "About", "Portfolio", "Contact"],
      anchors: ["home", "about", "portfolio", "contact"],
      menu: "#myMenu",

      autoScrolling: true,
      fitToSection: false,
      recordHistory: false,
      controlArrows: true,
      scrollHorizontally: false,
      scrollOverflow: false,

      afterLoad: function (origin, destination) {
        const index = destination.index;
        if (index === 1) {
          triggerAboutAnimations();
        }
      }
    });
  }

  // --- Hash navigation handling ---
  $(window).on("hashchange", function () {
    checkAboutSection();
  });

  $(window).on("scroll", function () {
    const aboutTop = $(".aboutme").offset().top;
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();

    if (scrollTop + windowHeight >= aboutTop + 100) {
      triggerAboutAnimations();
    }
  });

  // --- AJAX form ---
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

  // Heart pulse
  document.querySelector(".btn-lg").addEventListener("click", () => {
    const heart = document.querySelector(".pink.heart");
    heart.classList.remove("animate-heart");
    void heart.offsetWidth;
    heart.classList.add("animate-heart");
  });

  // Collapse mobile nav on desktop
function collapseNavOnDesktop() {
  if (window.innerWidth > 768) {
    $(".nav-screen").css({
      right: "-285px",
      transition: "right 0.2s"
    });
    $("body").removeClass("nav-open");
  }
}

// Run on resize
$(window).on("resize", collapseNavOnDesktop);

// Run on page load
collapseNavOnDesktop();


}); // END document.ready


/* --- Disable fullpage autoscroll on desktop project pages --- */
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;

  const isProjectPage =
    path.endsWith("atlas.html") ||
    path.endsWith("geo.html") ||
    path.endsWith("permafrost.html") ||
    path.endsWith("data.html") ||
    path.endsWith("strategy.html");

  if (isProjectPage) {
    const interval = setInterval(() => {
      if (window.fullpage_api) {
        try {
          fullpage_api.setAutoScrolling(false);
          clearInterval(interval);
        } catch (e) {}
      }
    }, 80);
  }
});
