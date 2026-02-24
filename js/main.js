import { SHEET_URLS } from "./config/sheetConfig.js";

/* MP LOGO MAP */
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
let dataSheet = [];
let channelSheet = [];

const container = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

/* GENERIC CSV PARSER */
function parseCSV(text) {
  const rows = text.trim().split("\n");
  const headers = rows[0].split(",");

  return rows.slice(1).map(row => {
    const cols = row.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = cols[i]?.trim();
    });
    return obj;
  });
}

/* LOAD STYLE IMAGES */
async function loadImages() {
  const res = await fetch("data/style_images.csv");
  const text = await res.text();
  const rows = parseCSV(text);

  rows.forEach(r => {
    imageMap[r.styleid.toUpperCase()] = r.image;
  });
}

/* LOAD STYLE MASTER SUMMARY */
async function loadStyleSummary() {
  const res = await fetch(SHEET_URLS.STYLE_SUMMARY);
  const text = await res.text();
  styleData = parseCSV(text).map(r => ({
    styleid: r.styleid,
    category: r.category,
    status: r.is_live === "TRUE" ? "live" : "non-live"
  }));
}

/* LOAD DATA SHEET */
async function loadDataSheet() {
  const res = await fetch(SHEET_URLS.DATA);
  const text = await res.text();
  dataSheet = parseCSV(text);
}

/* LOAD CHANNEL SHEET */
async function loadChannelSheet() {
  const res = await fetch(SHEET_URLS.CHANNEL_NAME);
  const text = await res.text();
  channelSheet = parseCSV(text);
}

/* GET MPs FOR STYLE */
function getMPsForStyle(styleid) {
  const rows = dataSheet.filter(r => r.styleid === styleid);

  const channelNames = rows.map(r => r.channel_name);

  const mps = channelNames.map(ch => {
    const match = channelSheet.find(c => c.channel_name === ch);
    return match?.mp;
  }).filter(Boolean);

  return [...new Set(mps)];
}

/* RENDER CARDS */
function renderCards(data) {
  container.innerHTML = "";

  data.slice(0, 16).forEach(style => {

    const imageSrc =
      imageMap[style.styleid?.toUpperCase()] ||
      "assets/brand/logo.png";

    const mpList = getMPsForStyle(style.styleid);

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
          ${renderLogos(mpList)}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/* RENDER MP LOGOS */
function renderLogos(mpList) {
  return mpList.map(mp => {
    const fileName = MP_LOGO_MAP[mp];
    if (!fileName) return "";

    return `
      <img src="assets/logos/${fileName}"
           class="mp-logo"
           onerror="this.style.display='none'">
    `;
  }).join("");
}

/* FILTER LOGIC */
function applyFilters() {
  let filtered = [...styleData];

  const searchValue = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;

  if (searchValue) {
    filtered = filtered.filter(s =>
      s.styleid?.toLowerCase().includes(searchValue)
    );
  }

  if (statusValue !== "all") {
    filtered = filtered.filter(s => s.status === statusValue);
  }

  renderCards(filtered);
}

searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);

/* INIT */
async function init() {
  await loadImages();
  await loadStyleSummary();
  await loadDataSheet();
  await loadChannelSheet();
  renderCards(styleData);
}

init();
