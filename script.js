$(document).ready(function () {
  let skillbarsAnimated = false;
  let catAnimated = false;

  /* ======================
     Typing animation
  ====================== */
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
            textSpan.addClass("cursor");
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

  /* ======================
     Nav toggle
  ====================== */
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

  /* ======================
     Dark / Light Mode
  ====================== */
  const headerToggle = document.getElementById("lightModeToggleHeader");
  const sidebarToggle = document.getElementById("lightModeToggleSidebar");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.classList.add("light-mode");
    headerToggle.checked = true;
    sidebarToggle.checked = true;
  }

  function applyLightMode(isLight) {
    document.documentElement.classList.toggle("light-mode", isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  }

  headerToggle?.addEventListener("change", e => applyLightMode(e.target.checked));
  sidebarToggle?.addEventListener("change", e => applyLightMode(e.target.checked));

  /* ======================
     Background image preload
  ====================== */
  const aboutSection = document.querySelector(".home");
  if (aboutSection) {
    const img = new Image();
    img.src = "images/yoshi.JPG";
    img.onload = () => {
      fetch("images/yoshi.JPG")
        .then(r => r.blob())
        .then(blob => {
          aboutSection.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
          aboutSection.classList.add("loaded");
          checkAboutSection();
        });
    };
  }

  /* ======================
     About animations
  ====================== */
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

  $(window).on("scroll", function () {
    const aboutTop = $(".home").offset()?.top;
    if (!aboutTop) return;

    if ($(window).scrollTop() + $(window).height() >= aboutTop + 100) {
      triggerAboutAnimations();
    }
  });

  /* ======================
     AJAX contact form
  ====================== */
  $("#ajax-contact").submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: this.action,
      data: $(this).serialize(),
      headers: { Accept: "application/json" }
    })
      .done(res => {
        $("#form-messages").removeClass("error").addClass("success").text(res.message || "Thanks!");
        $("#name, #email, #message").val("");
      })
      .fail(err => {
        $("#form-messages").removeClass("success").addClass("error").text("Something went wrong.");
        console.error(err);
      });
  });

  /* ======================
     Heart + plane animations
  ====================== */
  document.querySelector("#submit")?.addEventListener("click", () => {
    const plane = document.querySelector("#paper-plane");
    plane?.classList.remove("fly");
    void plane?.offsetWidth;
    plane?.classList.add("fly");
  });

  function pulseHeart() {
    const heart = document.querySelector(".pink.heart");
    if (!heart) return;
    heart.classList.remove("animate-heart");
    void heart.offsetWidth;
    heart.classList.add("animate-heart");
  }

  document.querySelector(".btn-lg")?.addEventListener("click", pulseHeart);
  document.querySelector(".pink.heart")?.addEventListener("mouseenter", pulseHeart);

  /* ======================
     Anchor system
  ====================== */
  function scrollToAnchor(hash) {
    if (!hash) return;
  
    const target = document.querySelector(hash);
    if (!target) return;
  
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    let top;
  
    if (hash === "#contact") {
      top = docHeight - winHeight;
    } else {
      const offsets = {
        "#home": window.innerWidth <= 768 ? -0 : -30,
        "#about": window.innerWidth <= 768 ? -30 : 0,
        "#portfolio": window.innerWidth <= 768 ? 40 : -50,
      };
      top = target.getBoundingClientRect().top + window.pageYOffset + (offsets[hash] || 0);
    }
  
    window.scrollTo({ top, behavior: "smooth" });
  }    

  document.querySelectorAll(".myMenu a, .header-links a").forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (!href || !href.includes("#")) return;

      e.preventDefault();

      const [path, hash] = href.split("#");
      const targetHash = `#${hash}`;

      if (!path || path === "" || window.location.pathname.endsWith(path)) {
        scrollToAnchor(targetHash);
      } else {
        sessionStorage.setItem("pendingAnchor", targetHash);
        window.location.href = path;
      }

      if ($("body").hasClass("nav-open")) {
        $(".nav-screen").animate({ right: "-285px" }, 200);
        $("body").removeClass("nav-open");
      }
    });
  });

  const pendingAnchor = sessionStorage.getItem("pendingAnchor");
  if (pendingAnchor) {
    sessionStorage.removeItem("pendingAnchor");
    setTimeout(() => scrollToAnchor(pendingAnchor), 100);
  }
  
});

/* ======================
   Portfolio carousel
====================== */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector('[data-anchor="portfolio"]');
  if (!section) return;

  const wrapper = section.querySelector(".content-slide");
  const slides = wrapper.querySelectorAll(".slide");
  let index = 0;

  function isDesktop() {
    return window.innerWidth >= 764;
  }

  function showSlide(i) {
    wrapper.scrollTo({
      left: slides[0].offsetWidth * i,
      behavior: "smooth"
    });
  }

  function setup() {
    if (!isDesktop()) {
      wrapper.style.display = "block";
      wrapper.style.overflow = "visible";
      slides.forEach(s => {
        s.style.display = "block";
        s.style.width = "auto";
        s.style.margin = "0 auto";
      });
      return;
    }

    wrapper.style.display = "flex";
    wrapper.style.overflow = "hidden";
    slides.forEach(s => (s.style.flex = "0 0 100%"));
    showSlide(index);
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

    prev.onclick = () => showSlide(index = (index - 1 + slides.length) % slides.length);
    next.onclick = () => showSlide(index = (index + 1) % slides.length);
  }

  window.addEventListener("resize", setup);
  setup();
  arrows();
});
