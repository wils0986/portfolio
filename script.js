$(document).ready(function () {
    // Flag to prevent re-animating skillbars multiple times
    let skillbarsAnimated = false;
    let catAnimated = false;
  
    // Typing animation
    (function ($) {
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
    })(jQuery);
  
    // Initialize typing
    $("#holder").writeText("Multimedia Designer and Digital Communications Specialist", 150);
  
    // initialize WOW.js
    new WOW().init();
  
    // Toggle nav
    var main = function () {
      $(".fa-bars").click(function () {
        $(".nav-screen").animate({ right: "0px" }, 200);
        $("body").animate({ right: "285px" }, 200);
      });
  
      $(".fa-times, .nav-links a").click(function () {
        $(".nav-screen").animate({ right: "-285px" }, 200);
        $("body").animate({ right: "0px" }, 200);
      });
    };
  
    $(document).ready(main);
  
    // FullPage.js v4 initialization
    new fullpage("#fullpage", {
      licenseKey: "5N17I-P8UU6-KQ9ZH-EZJ08-UJLLN",
      scrollBar: true,
      responsiveWidth: 768,
      navigation: true,
      navigationTooltips: ["home", "about", "portfolio", "contact", "connect"],
      anchors: ["home", "about", "portfolio", "contact", "connect"],
      menu: "#myMenu",
      fitToSection: false,
  
      afterLoad: function (origin, destination, direction) {
        const index = destination.index;
  
        // // Style header links for section 1 (About)
        // if (index === 1) {
          $(".fa-chevron-down").css("opacity", "1");
        //   $(".header-links a").css("color", "white");
        //   $(".header-links").css("background-color", "transparent");
        // } else {
        //   $(".header-links a").css("color", "black");
        //   $(".header-links").css("background-color", "white");
        // }
  
        // Animate skillbars & slide-in cat image
        if (index === 1 && !skillbarsAnimated) {
          $(".skillbar").each(function () {
            var percent = $(this).attr("data-percent");
            $(this)
              .find(".skillbar-bar")
              .animate({ width: percent }, 1000);
          });
          skillbarsAnimated = true; // prevent re-animation
  
          // Slide in cat image
          $(".cat").addClass("slide-in");
          catAnimated = true;
        } else if (index !== 1) {
        }
      }
    });
  
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
    var form = $("#ajax-contact");
    var formMessages = $("#form-messages");
  
    $(form).submit(function (e) {
      e.preventDefault();
      var formData = $(form).serialize();
  
      $.ajax({
        type: "POST",
        url: $(form).attr("action"),
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
        });
    });
  });

  // Plane animation
  document.querySelector("#submit").addEventListener("click", () => {
    const plane = document.querySelector("#paper-plane");
    plane.classList.remove("fly"); // reset
    void plane.offsetWidth;        // force reflow
    plane.classList.add("fly");
  });
  
 