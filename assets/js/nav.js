const navToggle = document.querySelector(".mobile-nav-toggle");
const nav = document.querySelector("nav");
const mobileNavOverlay = document.getElementById("mobile-nav-overlay");

navToggle.addEventListener("click", () => {
  nav.classList.toggle("mobile-nav-active");
  mobileNavOverlay.classList.toggle("active");

  if (nav.classList.contains("mobile-nav-active")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

mobileNavOverlay.addEventListener("click", () => {
  nav.classList.remove("mobile-nav-active");
  mobileNavOverlay.classList.remove("active");

  document.body.style.overflow = "";
});
