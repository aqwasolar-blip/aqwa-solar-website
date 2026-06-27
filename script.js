document.addEventListener("DOMContentLoaded", () => {
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedMode = localStorage.getItem("aqwa-theme");
const body = document.body;
const modeToggle = document.querySelector("[data-mode-toggle]");
const heroSlides = document.querySelectorAll(".hero-slide");
const statNumbers = document.querySelectorAll("[data-count]");
const comparisonRange = document.querySelector(".comparison-range");
const comparisonOverlay = document.querySelector(".comparison-overlay");
const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector(".lightbox-close");
const galleryItems = document.querySelectorAll("[data-lightbox]");

if ((savedMode === "dark") || (!savedMode && prefersDark)) {
body.classList.add("dark");
}

if (modeToggle) {
modeToggle.addEventListener("click", () => {
body.classList.toggle("dark");
localStorage.setItem("aqwa-theme", body.classList.contains("dark") ? "dark" : "light");
});
}

if (heroSlides.length > 1) {
let activeIndex = 0;
setInterval(() => {
heroSlides[activeIndex].classList.remove("is-active");
activeIndex = (activeIndex + 1) % heroSlides.length;
heroSlides[activeIndex].classList.add("is-active");
}, 5000);
}

const animateCounter = (element) => {
const target = Number(element.dataset.count || 0);
const duration = 1400;
const start = performance.now();

const step = (now) => {
const progress = Math.min((now - start) / duration, 1);
const value = Math.floor(progress * target);
element.textContent = target >= 1000 ? value.toLocaleString() : value;
if (progress < 1) requestAnimationFrame(step);
};

requestAnimationFrame(step);
};

if ("IntersectionObserver" in window) {
const statsObserver = new IntersectionObserver((entries, observer) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
animateCounter(entry.target);
observer.unobserve(entry.target);
}
});
}, { threshold: 0.5 });

statNumbers.forEach(item => statsObserver.observe(item));
} else {
statNumbers.forEach(animateCounter);
}

if (comparisonRange && comparisonOverlay) {
const updateComparison = () => {
comparisonOverlay.style.width = `${comparisonRange.value}%`;
};
comparisonRange.addEventListener("input", updateComparison);
updateComparison();
}

galleryItems.forEach(item => {
item.addEventListener("click", () => {
lightboxImage.src = item.dataset.lightbox;
lightbox.classList.add("is-open");
lightbox.setAttribute("aria-hidden", "false");
});
});

const closeLightbox = () => {
lightbox.classList.remove("is-open");
lightbox.setAttribute("aria-hidden", "true");
lightboxImage.src = "";
};

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
closeLightbox();
}
});
});
