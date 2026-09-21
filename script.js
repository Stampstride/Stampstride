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
  const picker = document.createElement("div");
  picker.className = "preferred-time-picker";
  picker.setAttribute("aria-label", "Preferred time picker");

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

  const hours = ["12", ...Array.from({ length: 11 }, (_, index) => String(index + 1))];
  const hourSelect = createSelect("hour", "Hour", hours.map(hour => [hour, hour]));
  const minuteSelect = createSelect("minute", "Minutes", ["00", "15", "30", "45"].map(minute => [minute, minute]));
  const periodSelect = createSelect("period", "AM or PM", [["AM", "AM"], ["PM", "PM"]]);
  const separator = document.createElement("span");
  separator.textContent = ":";
  separator.setAttribute("aria-hidden", "true");

  const hiddenTime = document.createElement("input");
  hiddenTime.type = "hidden";
  hiddenTime.name = "preferred_time";
  hiddenTime.value = "12:00 AM";

  const syncTime = () => {
    hiddenTime.value = `${hourSelect.value}:${minuteSelect.value} ${periodSelect.value}`;
  };

  [hourSelect, minuteSelect, periodSelect].forEach(select => {
    select.addEventListener("change", syncTime);
  });

  picker.append(hourSelect, separator, minuteSelect, periodSelect, hiddenTime);
  timeField.replaceWith(picker);
}

const phoneField = document.querySelector('input[name="phone"]');
if (phoneField) {
  phoneField.required = false;
  phoneField.removeAttribute("required");
  phoneField.maxLength = 14;
  phoneField.inputMode = "numeric";
  phoneField.autocomplete = "tel";
  phoneField.placeholder = "(000)-000-0000";
  phoneField.pattern = "^$|^\\(\\d{3}\\)-\\d{3}-\\d{4}$";

  phoneField.addEventListener("input", event => {
    const digits = (event.target.value || "").replace(/\D/g, "").slice(0, 10);

    if (!digits.length) {
      event.target.value = "";
      return;
    }

    if (digits.length <= 3) {
      event.target.value = `(${digits}`;
      return;
    }

    if (digits.length <= 6) {
      const tail = digits.slice(3);
      event.target.value = `(${digits.slice(0, 3)})-${tail}`;
      if (digits.length === 6) event.target.value += "-";
      return;
    }

    event.target.value = `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
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
