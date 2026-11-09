const artworks = [
  {
    category: "CHARACTER ILLUSTRATION",
    title: "The curious one",
    description: "A tiny daydreamer with a big personality. A study in soft shapes, warm light, and curious little details.",
    image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=1400&q=90",
    alt: "Placeholder artwork: cat portrait"
  },
  {
    category: "COZY LITTLE WORLDS",
    title: "A sunny afternoon",
    description: "A quiet moment, a soft patch of sunlight, and absolutely nowhere else to be. The best kind of afternoon.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=90",
    alt: "Placeholder artwork: colourful art supplies"
  },
  {
    category: "CREATURE DESIGN",
    title: "The tiny guardian",
    description: "A small friend with a very important job: keeping watch over the little things that make a place feel like home.",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1400&q=90",
    alt: "Placeholder artwork: expressive cat"
  }
];

let currentArt = 0;
const artImage = document.querySelector("#art-image");
const artTitle = document.querySelector("#art-title");
const artDescription = document.querySelector("#art-description");
const artCategory = document.querySelector("#art-category");
const artCount = document.querySelector("#art-count");
const dots = document.querySelector("#gallery-dots");

function showArtwork(index) {
  currentArt = (index + artworks.length) % artworks.length;
  const art = artworks[currentArt];
  artImage.classList.add("changing");
  window.setTimeout(() => {
    artImage.src = art.image;
    artImage.alt = art.alt;
    artTitle.textContent = art.title;
    artDescription.textContent = art.description;
    artCategory.textContent = art.category;
    artCount.textContent = `0${currentArt + 1} — 0${artworks.length}`;
    artImage.classList.remove("changing");
    [...dots.children].forEach((dot, i) => dot.classList.toggle("active", i === currentArt));
  }, 180);
}

artworks.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Show artwork ${index + 1}`);
  dot.addEventListener("click", () => showArtwork(index));
  dots.append(dot);
});
document.querySelector(".gallery-arrow.prev").addEventListener("click", () => showArtwork(currentArt - 1));
document.querySelector(".gallery-arrow.next").addEventListener("click", () => showArtwork(currentArt + 1));
showArtwork(0);

// Fade/slide elements in as they enter the viewport.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Commission form choices.
const choices = document.querySelectorAll(".choice-button");
const artFields = document.querySelector("#art-fields");
const otherFields = document.querySelector("#other-fields");
let requestKind = "art";
choices.forEach(button => button.addEventListener("click", () => {
  requestKind = button.dataset.kind;
  choices.forEach(item => item.classList.toggle("active", item === button));
  artFields.hidden = requestKind !== "art";
  otherFields.hidden = requestKind !== "other";
  document.querySelector("#form-status").textContent = "";
}));

const selected = { style: { value: "Flat colours", price: 45 }, background: { value: "No background", price: 0 } };
document.querySelectorAll(".price-option").forEach(button => button.addEventListener("click", () => {
  const group = button.dataset.group;
  selected[group] = { value: button.dataset.value, price: Number(button.dataset.price) };
  document.querySelectorAll(`.price-option[data-group="${group}"]`).forEach(item => item.classList.toggle("selected", item === button));
  document.querySelector("#total-price").textContent = `$${selected.style.price + selected.background.price}`;
}));

// Demo delivery: opens the visitor's email app with the request pre-filled.
// Replace ARTIST_EMAIL below with the email address you want to receive requests at.
const ARTIST_EMAIL = "hello@example.com";
document.querySelector("#request-form").addEventListener("submit", event => {
  event.preventDefault();
  const status = document.querySelector("#form-status");
  let subject, body, email;

  if (requestKind === "art") {
    email = document.querySelector("#art-email").value.trim();
    const details = document.querySelector("#art-details").value.trim();
    if (!email || !details) {
      status.textContent = "Please add your email and a few details about your idea.";
      return;
    }
    subject = "Art commission request";
    body = `Email: ${email}\nStyle: ${selected.style.value} (+$${selected.style.price})\nBackground: ${selected.background.value} (+$${selected.background.price})\nEstimated total: $${selected.style.price + selected.background.price}\n\nProject details:\n${details}`;
  } else {
    email = document.querySelector("#other-email").value.trim();
    const message = document.querySelector("#other-message").value.trim();
    if (!message) {
      status.textContent = "Please write a message before sending.";
      return;
    }
    subject = "Portfolio website enquiry";
    body = `Reply-to email: ${email || "Not provided"}\n\n${message}`;
  }

  const mailto = `mailto:${ARTIST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = "Your email app should open with the request ready to send. Please press Send there.";
  window.location.href = mailto;
});
