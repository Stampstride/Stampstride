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

function formatPhoneNumber(digits) {
  digits = digits.replace(/\D/g, "").slice(0, 10);

  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)})-${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

phoneField.addEventListener("input", event => {
  const input = event.target;

  // Get only the numbers
  const digits = input.value.replace(/\D/g, "").slice(0, 10);

  // Format the number
  input.value = formatPhoneNumber(digits);

  // Put cursor at the end after normal typing
  input.setSelectionRange(input.value.length, input.value.length);
});

phoneField.addEventListener("keydown", event => {
  const input = event.target;

  // Handle Backspace
  if (event.key === "Backspace") {
    const cursor = input.selectionStart;

    // If cursor is immediately after a formatting character,
    // skip over it and delete the digit before it.
    if (
      cursor > 0 &&
      (input.value[cursor - 1] === ")" ||
       input.value[cursor - 1] === "-" ||
       input.value[cursor - 1] === "(")
    ) {
      event.preventDefault();

      const digitsBefore = input.value
        .slice(0, cursor)
        .replace(/\D/g, "");

      const newDigits = digitsBefore.slice(0, -1) +
        input.value.slice(cursor).replace(/\D/g, "");

      input.value = formatPhoneNumber(newDigits);

      // Put cursor after the appropriate number of digits
      const targetDigits = Math.max(0, digitsBefore.length - 1);
      let newCursor = 0;
      let count = 0;

      while (newCursor < input.value.length && count < targetDigits) {
        if (/\d/.test(input.value[newCursor])) {
          count++;
        }
        newCursor++;
      }

      input.setSelectionRange(newCursor, newCursor);
    }
  }

  // Handle Delete
  if (event.key === "Delete") {
    const cursor = input.selectionStart;

    // If Delete is sitting directly before formatting,
    // skip the formatting and delete the next digit.
    if (
      cursor < input.value.length &&
      (input.value[cursor] === ")" ||
       input.value[cursor] === "-")
    ) {
      event.preventDefault();

      const digits = input.value.replace(/\D/g, "");

      // Determine which digit is being deleted
      const digitsBefore = input.value
        .slice(0, cursor)
        .replace(/\D/g, "").length;

      const newDigits =
        digits.slice(0, digitsBefore) +
        digits.slice(digitsBefore + 1);

      input.value = formatPhoneNumber(newDigits);

      // Restore cursor position
      let newCursor = 0;
      let count = 0;

      while (newCursor < input.value.length && count < digitsBefore) {
        if (/\d/.test(input.value[newCursor])) {
          count++;
        }
        newCursor++;
      }

      input.setSelectionRange(newCursor, newCursor);
    }
  }
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
