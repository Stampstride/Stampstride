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
  phoneField.pattern = "^$|\\([0-9]{3}\\)-[0-9]{3}-[0-9]{4}$";

phoneField.addEventListener("input", event => {
  const input = event.target;
  const oldValue = input.value;
  const oldCursor = input.selectionStart;

  // Count how many digits were before the cursor
  const digitsBeforeCursor = oldValue
    .slice(0, oldCursor)
    .replace(/\D/g, "").length;

  // Remove everything except numbers and limit to 10 digits
  const digits = oldValue.replace(/\D/g, "").slice(0, 10);

  let formatted = "";

  if (digits.length > 0) {
    formatted = `(${digits.slice(0, 3)}`;

    if (digits.length >= 3) {
      formatted += ")";
    }
  }

  if (digits.length > 3) {
    formatted += `-${digits.slice(3, 6)}`;
  }

  if (digits.length > 6) {
    formatted += `-${digits.slice(6, 10)}`;
  }

  input.value = formatted;

  // Find the new cursor position corresponding to the same digit
  let newCursor = 0;
  let digitCount = 0;

  while (newCursor < formatted.length && digitCount < digitsBeforeCursor) {
    if (/\d/.test(formatted[newCursor])) {
      digitCount++;
    }
    newCursor++;
  }

  // Put the cursor back in the correct position
  input.setSelectionRange(newCursor, newCursor);
});
}

const form = document.querySelector(".quote-form");
const status = document.querySelector(".form-status");

if (form) {
  // Use the active Formspree endpoint supplied for this site.
  form.action = "https://formspree.io/f/xvkgakow";

  form.addEventListener("submit", async (event) => {
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
