import { SHEET_URLS } from "./config/sheetConfig.js";

/* MP LIST */
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

/* LOGO MAP */
const MP_LOGO_MAP = {
  "SNAPDEAL": "snapdeal.png",
  "FLIPKART": "flipkart.png",
  "MIRRAW": "mirraw.png",
  "MEESHO": "meesho.png",
  "MYNTRA": "myntra.png",
  "SHOPIFY": "shopify.png",
  "TATA CLIQ": "tata.png",
  "AMAZON": "amazon.png",
  "LIMEROAD": "limeroad.png",
  "AJIO": "ajio.jpg",
  "NYKAA FASHION": "nykaa.png"
};

let imageMap = {};
let styleData = [];

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

/* LOAD STYLE IMAGE CSV (LOCAL) */
async function loadImages() {
  const response = await fetch("data/style_images.csv");
  const text = await response.text();

  const rows = text.split("\n").slice(1);
  rows.forEach(row => {
    const [styleid, image] = row.split(",");
    if (styleid && image) {
      imageMap[styleid.trim().toUpperCase()] = image.trim();
    }
  });
}

/* LOAD GOOGLE SHEET DATA */
async function loadSheetData() {
  const response = await fetch(SHEET_URLS.STYLE_SUMMARY);
  const text = await response.text();

  const rows = text.split("\n");
  const headers = rows[0].split(",");

  const styleidIndex = headers.indexOf("styleid");
  const categoryIndex = headers.indexOf("category");
  const isLiveIndex = headers.indexOf("is_live");

  styleData = rows.slice(1).map(row => {
    const cols = row.split(",");

    return {
      styleid: cols[styleidIndex]?.trim(),
      category: cols[categoryIndex]?.trim(),
      status: cols[isLiveIndex]?.trim() === "TRUE" ? "live" : "non-live",
      accounts: [],
      mps: {}
    };
  }).filter(s => s.styleid);
}

/* RENDER CARDS */
function renderCards(data) {
  container.innerHTML = "";

  data.slice(0, 16).forEach(style => {
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

        <div class="meta">
          Status: ${style.status.toUpperCase()}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/* FILTER LOGIC */
function applyFilters() {
  let filtered = [...styleData];

  const searchValue = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;

  if (searchValue) {
    filtered = filtered.filter(s =>
      s.styleid.toLowerCase().includes(searchValue)
    );
  }

  if (statusValue !== "all") {
    filtered = filtered.filter(s => s.status === statusValue);
  }

  renderCards(filtered);
}

/* EVENTS */
searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);

/* INIT */
async function init() {
  loadMPFilter();
  await loadImages();
  await loadSheetData();
  renderCards(styleData);
}

init();
