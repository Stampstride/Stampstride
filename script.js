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

const timeField = document.querySelector('input[name="preferred_time"]');
if (timeField) {
  timeField.type = "time";
  timeField.step = 900;
  timeField.removeAttribute("placeholder");
}

const phoneField = document.querySelector('input[name="phone"]');
if (phoneField) {
  phoneField.required = false;
  phoneField.removeAttribute("required");
  phoneField.maxLength = 14;
  phoneField.inputMode = "numeric";
  phoneField.autocomplete = "tel";
  phoneField.placeholder = "(000)-000-0000";
  phoneField.pattern = "^$|\\([0-9]{3}\\)-[0-9]{3}-[0-9]{4}$";

  const formatPhoneNumber = digits => {
    digits = digits.replace(/\D/g, "").slice(0, 10);
    if (!digits) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)})-${digits.slice(3)}`;
    return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  phoneField.addEventListener("input", event => {
    const input = event.target;
    input.value = formatPhoneNumber(input.value);
    input.setSelectionRange(input.value.length, input.value.length);
  });
}

const form = document.querySelector(".quote-form");
const status = document.querySelector(".form-status");

if (form) {
  form.action = "https://formspree.io/f/xvkgakow";

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    const original = button.innerHTML;
    button.disabled = true;
    button.innerHTML = "Sending…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Form submission failed");
      window.location.href = "thank-you.html";
    } catch (error) {
      status.textContent = "We couldn't send the request. Please email inquiries@stampstride.com directly.";
      status.style.color = "#9b4c36";
      button.disabled = false;
      button.innerHTML = original;
    }
  });
}
