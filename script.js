/* jshint esversion: 11 */
/* global $, jQuery, WOW, fullpage, fullpage_api */

$(document).ready(function () {
  // Flag to prevent re-animating skillbars multiple times
  let skillbarsAnimated = false;
  let catAnimated = false;

  // Typing animation plugin
  (function ($) {
    if (!$.fn.writeText) {
      $.fn.writeText = function (content, speed = 100) {
        const elem = this;
        let current = 0;

        // Remove previous content and add new container with blinking cursor
        elem.html('<span class="typed-text"></span><span class="cursor">|</span>');
        const textSpan = elem.find(".typed-text");

        function type() {
          if (current < content.length) {
            textSpan.append(content[current++]);
            setTimeout(type, speed);
          }
        }

        type();
      };
    }
  })(jQuery);

  // Wait 1.2 seconds before starting typing
  setTimeout(() => {
    // Make holder visible
    $("p.holder").css("visibility", "visible");

    // Start typewriter effect
    $("#holder").writeText("Multimedia Designer and Digital Communications Specialist", 150);
  }, 2800);

  // Initialize WOW.js
  new WOW().init();

  // Toggle nav
  function main() {
    $(".fa-bars").click(function () {
      $(".nav-screen").animate({ right: "0px" }, 200);
      $("body").animate({ right: "285px" }, 200);
    });

    $(".fa-times, .nav-links a").click(function () {
      $(".nav-screen").animate({ right: "-285px" }, 200);
      $("body").animate({ right: "0px" }, 200);
    });
  }

  main(); // Run nav toggle setup

  // PRELOAD background image for .aboutme BEFORE initializing fullPage
  const aboutSection = document.querySelector(".aboutme");
  const bgImg = new Image();
  bgImg.src = "images/leaves-min.JPG";

bgImg.onload = function () {
  // Set the background image styles
  aboutSection.style.backgroundImage = `url(${bgImg.src})`;
  aboutSection.style.backgroundSize = "cover";
  aboutSection.style.backgroundPosition = "center";
  aboutSection.style.backgroundRepeat = "no-repeat";

  // Apply dark overlay with box-shadow
  aboutSection.style.boxShadow = "inset 0 0 0 2000px rgba(31, 32, 32, 0.63)";

  // Optional: add a class for transitions like fade-in
  aboutSection.classList.add("loaded");

    // Now initialize fullPage AFTER background image is loaded
    initFullPage();
  };

  function initFullPage() {
    const isMobile = window.innerWidth <= 768;

    new fullpage("#fullpage", {
      licenseKey: "5N17I-P8UU6-KQ9ZH-EZJ08-UJLLN",
      scrollBar: true,
      responsiveWidth: 1366,
      adjustOnNavChange: false,
      navigation: true,
      anchors: ["home", "about", "portfolio", "contact"],
      menu: "#myMenu",
      autoScrolling: !isMobile,
      fitToSection: !isMobile,

      afterLoad: function (origin, destination, direction) {
        const index = destination.index;

        // Always show down arrow on section load
        $(".fa-chevron-down").css("opacity", "1");

        // Animate skillbars & slide-in cat image only once
        if (index === 1 && !skillbarsAnimated) {
          $(".skillbar").each(function () {
            const percent = $(this).attr("data-percent");
            $(this).find(".skillbar-bar").animate({ width: percent }, 1000);
          });
          skillbarsAnimated = true;

          $(".cat").addClass("slide-in");
          catAnimated = true;
        }
      }
    });
  }

  // Scroll down button
  $(document).on("click", "#moveDown", function () {
    fullpage_api.moveSectionDown();
  });

  // Smooth scroll fallback
  document.querySelectorAll("a[href*='#']:not([href='#'])").forEach(function (link) {
    link.addEventListener("click", function (e) {
      const currentPath = window.location.pathname.replace(/^\//, "");
      const targetPath = link.pathname.replace(/^\//, "");
      const samePage = currentPath === targetPath && window.location.hostname === link.hostname;

      if (samePage) {
        const targetId = link.hash.slice(1);
        const target = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`);
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: target.offsetTop,
            behavior: "smooth"
          });
        }
      }
    });
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
      headers: {
        'Accept': 'application/json'
      }
    })
      .done(function (response) {
        formMessages.removeClass("error").addClass("success").text(response.message || "Thanks! Your message has been sent.");
        $("#name, #email, #message").val("");
      })
      .fail(function (data) {
        formMessages.removeClass("success").addClass("error");
        formMessages.text(
          data.responseText || "Oops! An error occurred and your message could not be sent."
        );
        console.error(data); // Log error to console
      });
  });

  // Plane animation
  document.querySelector("#submit")?.addEventListener("click", () => {
    const plane = document.querySelector("#paper-plane");
    if (plane) {
      plane.classList.remove("fly"); // Reset
      void plane.offsetWidth;        // Force reflow
      plane.classList.add("fly");
    }
  });
});

// Heart pulse on .submit click
document.querySelector(".btn-lg").addEventListener("click", () => {
  const heart = document.querySelector(".pink.heart");

  // Remove the animation class to allow retriggering
  heart.classList.remove("animate-heart");

  // Trigger reflow to restart animation
  void heart.offsetWidth;

  // Add the animation class
  heart.classList.add("animate-heart");
});

const menuIcon = document.querySelector('.fa-bars');
const closeIcon = document.querySelector('.fa-times');
const navScreen = document.querySelector('.nav-screen');

menuIcon.addEventListener('click', () => {
  navScreen.classList.add('open');
  menuIcon.setAttribute('aria-expanded', 'true');
});

closeIcon.addEventListener('click', () => {
  navScreen.classList.remove('open');
  menuIcon.setAttribute('aria-expanded', 'false');
});
