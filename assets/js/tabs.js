document.addEventListener("DOMContentLoaded", () => {
  const tabsContainer = document.getElementById("tabs");
  if (!tabsContainer) return;

  const tabButtons = Array.from(tabsContainer.querySelectorAll("[data-tab]"));
  const tabContents = Array.from(
    document.querySelectorAll("[data-tab-content]")
  );

  function activateTab(tabName) {
    if (!tabName) return;

    tabButtons.forEach((btn) => {
      const isActive = btn.getAttribute("data-tab") === tabName;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    tabContents.forEach((el) => {
      const match = el.getAttribute("data-tab-content") === tabName;
      el.style.display = match ? "" : "none";
      el.setAttribute("aria-hidden", match ? "false" : "true");
    });

    document.dispatchEvent(
      new CustomEvent("tabChanged", {
        detail: { tab: tabName },
      })
    );
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-tab");
      activateTab(name);
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  const initiallyActive =
    tabButtons.find((b) => b.classList.contains("active")) || tabButtons[0];
  const initialName = initiallyActive
    ? initiallyActive.getAttribute("data-tab")
    : null;
  activateTab(initialName);
});
