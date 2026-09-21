const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    mobileNav.setAttribute("aria-hidden", open ? "false" : "true");
  });
}

document.querySelectorAll(".mobile-nav a").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const dateField = document.querySelector('input[name="preferred_date"]');
if (dateField) {
  dateField.min = new Date().toISOString().split("T")[0];
}

const phoneField = document.querySelector('input[name="phone"]');
if (phoneField) {
  // Phone is optional, but when provided it must use (000)-000-0000.
  phoneField.required = false;
  phoneField.removeAttribute("required");
  phoneField.maxLength = 14;
  phoneField.inputMode = "numeric";
  phoneField.autocomplete = "tel";
  phoneField.placeholder = "(000)-000-0000";
  phoneField.pattern = "^$|\\([0-9]{3}\\)-[0-9]{3}-[0-9]{4}";

  phoneField.addEventListener("input", event => {
    const digits = event.target.value.replace(/\\D/g, "").slice(0, 10);
    let formatted = "";

    if (digits.length > 0) formatted = `(${digits.slice(0, 3)}`;
    if (digits.length >= 3) formatted += ")-";
    if (digits.length > 3) formatted += digits.slice(3, 6);
    if (digits.length >= 6) formatted += "-";
    if (digits.length > 6) formatted += digits.slice(6, 10);

    event.target.value = formatted;
  });
}

const form = document.querySelector(".quote-form");
const status = document.querySelector(".form-status");

if (form) {
  form.addEventListener("submit", async (event) => {
    // Let Formspree handle the actual POST. This fallback only improves the
    // experience if Formspree returns JSON rather than redirecting.
    if (!form.action.includes("formspree.io") || form.action.includes("YOUR_FORMSPREE_FORM_ID")) {
      event.preventDefault();
      status.textContent = "The form is not connected yet. Replace YOUR_FORMSPREE_FORM_ID with your Formspree form ID.";
      status.style.color = "#9b4c36";
      return;
    }

    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    const original = button.innerHTML;
    button.disabled = true;
    button.innerHTML = "Sending…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        window.location.href = "thank-you.html";
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      status.textContent = "We couldn't send the request. Please email inquiries@stampstride.com directly.";
      status.style.color = "#9b4c36";
      button.disabled = false;
      button.innerHTML = original;
    }
  });
}
