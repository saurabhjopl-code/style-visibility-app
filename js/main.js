const mockData = [
  {
    styleid: "JOPLST218",
    category: "Casual",
    status: "live",
    accounts: ["ACC1", "ACC2"],
    mps: {
      Amazon: true,
      Flipkart: true,
      Myntra: true,
      Meesho: false
    }
  },
  {
    styleid: "FORMAL229",
    category: "Formal",
    status: "non-live",
    accounts: [],
    mps: {
      Amazon: false,
      Flipkart: false,
      Myntra: false,
      Meesho: false
    }
  }
];

let imageMap = {};

const container = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const mpFilter = document.getElementById("mpFilter");

/* ===== LOAD CSV IMAGES ===== */
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

/* ===== RENDER CARDS ===== */
function renderCards(data) {
  container.innerHTML = "";

  data.forEach(style => {
    const card = document.createElement("div");
    card.className = "style-card";

    const imageSrc =
      imageMap[style.styleid.toUpperCase()] ||
      "assets/brand/logo.png";

    card.innerHTML = `
      <div class="style-top">
        <img src="${imageSrc}"
             class="style-image"
             onerror="this.src='assets/brand/logo.png'">

        <div class="style-info">
          <div class="style-header">
            <div class="style-title">
              <span class="status-dot ${style.status}"></span>
              <h3>${style.styleid}</h3>
            </div>
            <span class="category">${style.category}</span>
          </div>

          <div class="mp-row">
            ${renderLogos(style.mps)}
          </div>

          <div class="meta">
            Accounts: ${style.accounts.length ? style.accounts.join(", ") : "-"}
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderLogos(mps) {
  let html = "";
  Object.keys(mps).forEach(mp => {
    const live = mps[mp];
    const className = live ? "mp-logo" : "mp-logo not-live";
    html += `<img src="assets/logos/${mp.toLowerCase()}.png" class="${className}">`;
  });
  return html;
}

/* ===== FILTER LOGIC ===== */
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

/* ===== EVENT LISTENERS ===== */
searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);
mpFilter.addEventListener("change", applyFilters);

/* ===== INIT ===== */
async function init() {
  await loadImages();
  renderCards(mockData);
}

init();
