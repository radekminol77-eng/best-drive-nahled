function updateDashboard() {
  const now = new Date();
  const day = now.getDay(); // 0 = Ne, 1 = Po...
  const hour = now.getHours();
  const min = now.getMinutes();
  const currentTime = hour + min / 60;

  const statusElement = document.querySelector(".js-status");
  const terminElement = document.querySelector(".js-termin");

  let isOpen = false;

  // Po-Pá: 7:00 – 11:30, 12:00 – 16:00
  if (day >= 1 && day <= 5) {
    if (
      (currentTime >= 7 && currentTime < 11.5) ||
      (currentTime >= 12 && currentTime < 16)
    ) {
      isOpen = true;
    }
  }

  // --- 1. LOKALITA (S pulzováním i pro červenou) ---
  if (statusElement) {
    const color = isOpen ? "#2ecc71" : "#e74c3c";
    const text = isOpen ? "Šumperk - Otevřeno" : "Šumperk - Zavřeno";
    // Tady přidáváme class="pulse-dot", aby to blikalo pořád
    statusElement.innerHTML = `<span class="pulse-dot" style="color: ${color};">●</span> ${text}`;
  }

  // --- 2. NEJBLIŽŠÍ TERMÍN (S tečkou) ---
  if (terminElement) {
    let terminText = "";
    if (!isOpen) {
      terminText = "Zítra v 8:00";
    } else {
      let terminHour = hour + 2;
      if (terminHour >= 16) {
        terminText = "Zítra v 7:30";
      } else {
        terminText = `Dnes v ${terminHour}:30`;
      }
    }
    terminElement.innerHTML = `<span class="pulse-dot" style="color: #2ecc71;">●</span> ${terminText}`;
  }
} // <--- TATO ZÁVORKA TI TAM CHYBĚLA

updateDashboard();
setInterval(updateDashboard, 60000);

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("mobile-menu");
  const menu = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links a");

  // 1. LOGIKA BURGER MENU
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    menu.classList.toggle("active");
    // Zamknutí scrollu, když je menu otevřené
    document.body.style.overflow = menu.classList.contains("active")
      ? "hidden"
      : "auto";
  });

  // Zavřít menu po kliknutí na odkaz
  links.forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("active");
      menu.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });

  // 2. SCROLL REVEAL ANIMACE (Intersection Observer)
  const observerOptions = {
    threshold: 0.15, // Spustí se, když je 15 % prvku vidět
    rootMargin: "0px 0px -50px 0px", // Trochu dřívější trigger pro lepší pocit
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Jakmile se jednou animuje, přestaneme sledovat (lepší výkon)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Vyhledá všechny animační třídy, které jsme si definovali
  const elementsToReveal = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-top, .reveal-scale",
  );

  elementsToReveal.forEach((el) => observer.observe(el));
});

let lastScrollY = window.scrollY;
let ticking = false;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const navLinks = document.querySelector(".nav-links");

      if (navLinks && navLinks.classList.contains("active")) {
        ticking = false;
        return;
      }

      // Přidáme větší toleranci (třeba 15px), aby to nereagovalo na mikro-pohyby
      if (Math.abs(currentScrollY - lastScrollY) > 15) {
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          // Scrollování dolů - schovat plynule
          navbar.classList.add("navbar--hidden");
        } else {
          // Scrollování nahoru - vytáhnout plynule
          navbar.classList.remove("navbar--hidden");
        }
        lastScrollY = currentScrollY;
      }
      ticking = false;
    });
    ticking = true;
  }
});

/* ============================================================
   BENTO SWIPER CONFIGURATION (STABLE 3.2 LOOK)
   ============================================================ */

const bentoSwiper = new Swiper(".bento-swiper", {
  loop: false,
  rewind: true,
  speed: 800,
  grabCursor: true,

  // Stabilita
  roundLengths: true,
  updateOnWindowResize: true,
  watchSlidesProgress: true,
  observer: true,
  observeParents: true,

  // --- KLÍČOVÉ NASTAVENÍ ŠÍŘKY ---
  // Změněno na 3.2, aby karty nebyly ani nudle, ani úzké sloupce
  spaceBetween: 30,
  slidesPerView: 3.2,
  centeredSlides: false,

  navigation: {
    nextEl: ".swiper-next",
    prevEl: ".swiper-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 24,
    },
    1200: {
      slidesPerView: 3.2, // Tady to držíme na 3.2
      spaceBetween: 30,
    },
    1600: {
      slidesPerView: 3.8, // Na ultra-wide monitoru povolíme víc
      spaceBetween: 30,
    },
  },

  on: {
    transitionEnd: function () {
      this.update();
    },
  },
});
