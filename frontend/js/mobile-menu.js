function carregarMenuMobile() {
  const body = document.body;

  if (document.querySelector(".mobile-menu-button")) {
    return;
  }

  const mobileButton = document.createElement("button");
  mobileButton.className = "mobile-menu-button";
  mobileButton.setAttribute("aria-label", "Abrir menu");
  mobileButton.innerHTML = `<i data-lucide="menu"></i>`;

  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";

  body.appendChild(mobileButton);
  body.appendChild(overlay);

  mobileButton.addEventListener("click", () => {
    body.classList.add("sidebar-open");
  });

  overlay.addEventListener("click", () => {
    body.classList.remove("sidebar-open");
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest(".menu a");

    if (link) {
      body.classList.remove("sidebar-open");
    }
  });

  lucide.createIcons();
}
