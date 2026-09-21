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

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// The decorative mark is not needed in the hero card.
document.querySelector(".stamp-mark")?.remove();

const dateField = document.querySelector('input[name="preferred_date"]');
if (dateField) {
  dateField.min = new Date().toISOString().split("T")[0];
}

const timeField = document.querySelector('input[name="preferred_time"]');
if (timeField) {
  const picker = document.createElement("div");
  picker.className = "preferred-time-picker";
  picker.setAttribute("role", "group");
  picker.setAttribute("aria-label", "Preferred time");

  const createSelect = (part, label, options) => {
    const select = document.createElement("select");
    select.dataset.timePart = part;
    select.setAttribute("aria-label", label);
    options.forEach(([value, text]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      select.appendChild(option);
    });
    return select;
  };

  const hours = Array.from({ length: 12 }, (_, index) => {
    const hour = String(index + 1);
    return [hour, hour];
  });
  const minutes = Array.from({ length: 60 }, (_, index) => {
    const minute = String(index).padStart(2, "0");
    return [minute, minute];
  });
  const periods = [["AM", "AM"], ["PM", "PM"]];

  const hourSelect = createSelect("hour", "Hour", hours);
  const minuteSelect = createSelect("minute", "Minute", minutes);
  const periodSelect = createSelect("period", "AM or PM", periods);
  const separator = document.createElement("span");
  separator.textContent = ":";
  separator.setAttribute("aria-hidden", "true");

  const hiddenTime = document.createElement("input");
  hiddenTime.type = "hidden";
  hiddenTime.name = "preferred_time";

  const syncTime = () => {
    hiddenTime.value = `${hourSelect.value}:${minuteSelect.value} ${periodSelect.value}`;
  };

  [hourSelect, minuteSelect, periodSelect].forEach(select => {
    select.addEventListener("change", syncTime);
  });
  syncTime();

  picker.append(hourSelect, separator, minuteSelect, periodSelect, hiddenTime);
  timeField.replaceWith(picker);
}

const phoneField = document.querySelector('input[name="phone"]');
if (phoneField) {
  phoneField.maxLength = 14;
  phoneField.inputMode = "numeric";
  phoneField.autocomplete = "tel";
  phoneField.placeholder = "(000)-000-0000";
  phoneField.pattern = "^\\(\\d{3}\\)-\\d{3}-\\d{4}$";

  const formatPhoneNumber = digits => {
    if (digits.length <= 3) return digits ? `(${digits}` : "";
    if (digits.length <= 6) return `(${digits.slice(0, 3)})-${digits.slice(3)}`;
    return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  phoneField.addEventListener("input", event => {
    const input = event.target;
    const cursor = input.selectionStart ?? input.value.length;
    const digitsBeforeCursor = input.value.slice(0, cursor).replace(/\D/g, "").length;
    const digits = input.value.replace(/\D/g, "").slice(0, 10);
    const formatted = formatPhoneNumber(digits);

    input.value = formatted;

    // Keep the caret beside the same digit so edits and backspace work naturally.
    if (document.activeElement === input) {
      let position = 0;
      let digitCount = 0;
      while (position < formatted.length && digitCount < digitsBeforeCursor) {
        if (/\d/.test(formatted[position])) digitCount++;
        position++;
      }
      input.setSelectionRange(position, position);
    }
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
      if (status) {
        status.textContent = "We couldn't send the request. Please email inquiries@stampstride.com directly.";
        status.style.color = "#9b4c36";
      }
      button.disabled = false;
      button.innerHTML = original;
    }
  });
}
