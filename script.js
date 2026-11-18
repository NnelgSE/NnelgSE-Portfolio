// ================= THEME TOGGLE ENGINE =================
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Initialize saved theme or system preference
const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  root.classList.add("dark");
} else {
  root.classList.remove("dark");
}

function updateThemeUI() {
  const isDark = root.classList.contains("dark");
  if (themeIcon) {
    themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}
updateThemeUI();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    root.classList.toggle("dark");
    const isDark = root.classList.contains("dark");
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    updateThemeUI();
  });
}

// ================= HERO BACKGROUND SLIDER (3 Images, 2.8s Transition) =================
const heroSlides = document.querySelectorAll(".hero-slide");
if (heroSlides.length > 0) {
  let currentSlideIndex = 0;
  const slideIntervalMs = 2800;

  setInterval(() => {
    heroSlides[currentSlideIndex].classList.remove("active");
    currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
    heroSlides[currentSlideIndex].classList.add("active");
  }, slideIntervalMs);
}

// ================= MOBILE NAVIGATION =================
const menuToggle = document.getElementById("menuToggle");
const menuIcon = document.getElementById("menuIcon");
const mobileNav = document.getElementById("mobileNav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isClosed = mobileNav.classList.toggle("hidden");
    if (menuIcon) {
      menuIcon.className = isClosed ? "fa-solid fa-bars" : "fa-solid fa-xmark";
    }
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.add("hidden");
      if (menuIcon) {
        menuIcon.className = "fa-solid fa-bars";
      }
    });
  });
}

// ================= BADGES LIGHTBOX & VERIFICATION MODAL =================
const badgesModal = document.getElementById("badgesModal");
const openBadgesModalBtn = document.getElementById("openBadgesModalBtn");
const viewOriginalBadgesBtn = document.getElementById("viewOriginalBadgesBtn");
const closeBadgesModalBtn = document.getElementById("closeBadgesModalBtn");
const closeBadgesModalBottomBtn = document.getElementById(
  "closeBadgesModalBottomBtn",
);
const badgeModalTitle = document.getElementById("badgeModalTitle");

function openBadgeModalDirect() {
  if (badgesModal) {
    if (badgeModalTitle)
      badgeModalTitle.textContent = "My Badges & Certifications (4 Courses)";
    badgesModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function openBadgePreview(badgeTitle, metaInfo, program) {
  if (badgesModal) {
    if (badgeModalTitle) {
      badgeModalTitle.textContent = `${badgeTitle} — ${metaInfo}`;
    }
    badgesModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeBadgesModal() {
  if (badgesModal) {
    badgesModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
}

if (openBadgesModalBtn)
  openBadgesModalBtn.addEventListener("click", openBadgeModalDirect);
if (viewOriginalBadgesBtn)
  viewOriginalBadgesBtn.addEventListener("click", openBadgeModalDirect);
if (closeBadgesModalBtn)
  closeBadgesModalBtn.addEventListener("click", closeBadgesModal);
if (closeBadgesModalBottomBtn)
  closeBadgesModalBottomBtn.addEventListener("click", closeBadgesModal);

if (badgesModal) {
  badgesModal.addEventListener("click", (e) => {
    if (e.target === badgesModal) closeBadgesModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    badgesModal &&
    !badgesModal.classList.contains("hidden")
  ) {
    closeBadgesModal();
  }
});

// ================= COPY BADGE VERIFICATION LINK & TOAST =================
const toastNotification = document.getElementById("toastNotification");
const toastMsg = document.getElementById("toastMsg");
let toastTimeout;

function showToast(message) {
  if (!toastNotification) return;
  if (toastMsg) toastMsg.textContent = message;

  toastNotification.classList.remove(
    "opacity-0",
    "pointer-events-none",
    "translate-y-4",
  );
  toastNotification.classList.add("opacity-100", "translate-y-0");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastNotification.classList.remove("opacity-100", "translate-y-0");
    toastNotification.classList.add(
      "opacity-0",
      "pointer-events-none",
      "translate-y-4",
    );
  }, 3000);
}

function copyBadgeLink(badgeName, buttonElement) {
  const dummyVerificationUrl = `${window.location.origin}${window.location.pathname.replace(
    /[^\/]*$/,
    "",
  )}resume.html#resumeView`;

  navigator.clipboard.writeText(dummyVerificationUrl).then(
    () => {
      showToast(`Copied verification link for "${badgeName}"!`);
      if (buttonElement) {
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML =
          '<i class="fa-solid fa-check text-emerald-400 mr-1"></i> Copied!';
        setTimeout(() => {
          buttonElement.innerHTML = originalText;
        }, 2200);
      }
    },
    () => {
      showToast("Verification link ready on Resume page.");
    },
  );
}

// ================= CONTACT FORM REDIRECTION HANDLER =================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Store details locally to display on the success page
    localStorage.setItem("last_contact_email", email);
    localStorage.setItem("last_contact_subject", subject);

    if (formStatus) {
      formStatus.classList.remove("hidden");
      formStatus.textContent = "Sending your message...";
      formStatus.className = "text-xs text-center text-brand-600 mt-2";
    }

    try {
      // REPLACE THE_FORMSPREE_ID' with actual Formspree endpoint ID
      const response = await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        contactForm.reset();
        window.location.href = "success.html";
      } else {
        throw new Error("Form submission error");
      }
    } catch (error) {
      // Fallback redirection if fetch has CORS or network restrictions
      window.open("success.html", "_blank");
    }
  });
}

// ================= DYNAMIC YEAR =================
const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

// ================= CERTIFICATION CAROUSEL =================
(() => {
  const carouselImage = document.getElementById("modalBadgeImg");
  const previousButton = document.getElementById("prevBadgeBtn");
  const nextButton = document.getElementById("nextBadgeBtn");
  const counter = document.getElementById("badgeCounter");

  if (!carouselImage || !previousButton || !nextButton || !counter) return;

  const certificateImages = [
    { src: "assets/My Badges.jpg", alt: "My Badges and Certifications" },
    { src: "assets/verification.png", alt: "My Badges and Certifications" },
    { src: "assets/certificate_2.PNG", alt: "Certificate Overview" },
  ];

  let currentImageIndex = 0;

  function updateCarousel() {
    carouselImage.src = certificateImages[currentImageIndex].src;
    carouselImage.alt = certificateImages[currentImageIndex].alt;
    counter.textContent = `${currentImageIndex + 1} / ${certificateImages.length}`;
  }

  previousButton.addEventListener("click", () => {
    currentImageIndex--;
    if (currentImageIndex < 0) currentImageIndex = certificateImages.length - 1;
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    currentImageIndex++;
    if (currentImageIndex >= certificateImages.length) currentImageIndex = 0;
    updateCarousel();
  });

  updateCarousel();
})();

// ================= PROJECT IMAGE SLIDER ON HOVER =================
const projectSlideIntervals = {};

function startImageSlide(cardClass) {
  const images = document.querySelectorAll("." + cardClass);
  if (images.length === 0) return;

  let currentIndex = 0;

  if (projectSlideIntervals[cardClass]) {
    clearInterval(projectSlideIntervals[cardClass]);
  }

  projectSlideIntervals[cardClass] = setInterval(() => {
    images[currentIndex].style.opacity = "0";
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].style.opacity = "1";
  }, 2200);
}

function stopImageSlide(cardClass) {
  if (projectSlideIntervals[cardClass]) {
    clearInterval(projectSlideIntervals[cardClass]);
    projectSlideIntervals[cardClass] = null;
  }

  const images = document.querySelectorAll("." + cardClass);
  images.forEach((img, index) => {
    img.style.opacity = index === 0 ? "1" : "0";
  });
}
