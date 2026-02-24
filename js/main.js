const MP_LIST = [
  "SNAPDEAL",
  "FLIPKART",
  "MIRRAW",
  "MEESHO",
  "MYNTRA",
  "SHOPIFY",
  "TATA CLIQ",
  "AMAZON",
  "LIMEROAD",
  "AJIO",
  "NYKAA FASHION"
];

/* 🔥 SAFE MP LOGO MAP */
const MP_LOGO_MAP = {
  "SNAPDEAL": "snapdeal.png",
  "FLIPKART": "flipkart.png",
  "MIRRAW": "mirraw.png",
  "MEESHO": "meesho.png",
  "MYNTRA": "myntra.png",
  "SHOPIFY": "shopify.png",
  "TATA CLIQ": "tata.png",          // because you uploaded tata.png
  "AMAZON": "amazon.png",
  "LIMEROAD": "limeroad.png",
  "AJIO": "ajio.png",
  "NYKAA FASHION": "nykaa.png"      // because you uploaded Nykaa.png
};

/* MOCK 16 STYLES */
const mockData = Array.from({ length: 16 }, (_, i) => ({
  styleid: `STYLE${1000 + i}`,
  category: "Category",
  status: i % 2 === 0 ? "live" : "non-live",
  accounts: ["ACC1"],
  mps: Object.fromEntries(
    MP_LIST.map(mp => [mp, Math.random() > 0.5])
  )
}));

let imageMap = {};

const container = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const mpFilter = document.getElementById("mpFilter");

/* LOAD MP FILTER */
function loadMPFilter() {
  MP_LIST.forEach(mp => {
    const option = document.createElement("option");
    option.value = mp;
    option.textContent = mp;
    mpFilter.appendChild(option);
  });
}

/* LOAD IMAGE CSV */
async function loadImages() {
  try {
    const response = await fetch("data/style_images.csv");
    const text = await response.text();
    parseCSV(text);
  } catch (error) {
    console.error("Error loading image CSV:", error);
  }
}

function parseCSV(csvText) {
  const rows = csvText.split("\n").slice(1);
  rows.forEach(row => {
    const [styleid, image] = row.split(",");
    if (styleid && image) {
      imageMap[styleid.trim().toUpperCase()] = image.trim();
    }
  });
}

/* RENDER CARDS */
function renderCards(data) {
  container.innerHTML = "";

  data.forEach(style => {
    const imageSrc =
      imageMap[style.styleid.toUpperCase()] ||
      "assets/brand/logo.png";

    const card = document.createElement("div");
    card.className = "style-card";

    card.innerHTML = `
      <div class="style-top">
        <img src="${imageSrc}"
             class="style-image"
             onerror="this.src='assets/brand/logo.png'">

        <div class="style-title">
          <span class="status-dot ${style.status}"></span>
          <h3>${style.styleid}</h3>
        </div>

        <div class="category">${style.category}</div>

        <div class="mp-row">
          ${renderLogos(style.mps)}
        </div>

        <div class="meta">
          Accounts: ${style.accounts.join(", ")}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/* SAFE LOGO RENDERING */
function renderLogos(mps) {
  return Object.keys(mps).map(mp => {
    const live = mps[mp];
    const fileName = MP_LOGO_MAP[mp];

    if (!fileName) return "";

    const className = live ? "mp-logo" : "mp-logo not-live";

    return `
      <img src="assets/logos/${fileName}"
           class="${className}"
           onerror="this.style.display='none'">
    `;
  }).join("");
}

/* FILTER LOGIC */
function applyFilters() {
  let filtered = [...mockData];

  const searchValue = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;
  const mpValue = mpFilter.value;

  if (searchValue) {
    filtered = filtered.filter(s =>
      s.styleid.toLowerCase().includes(searchValue)
    );
  }

  if (statusValue !== "all") {
    filtered = filtered.filter(s => s.status === statusValue);
  }

  if (mpValue !== "all") {
    filtered = filtered.filter(s => s.mps[mpValue]);
  }

  renderCards(filtered);
}

searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);
mpFilter.addEventListener("change", applyFilters);

/* INIT */
async function init() {
  loadMPFilter();
  await loadImages();
  renderCards(mockData);
}

init();
