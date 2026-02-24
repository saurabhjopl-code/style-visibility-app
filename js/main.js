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

const container = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const mpFilter = document.getElementById("mpFilter");

function renderCards(data) {
  container.innerHTML = "";

  data.forEach(style => {
    const card = document.createElement("div");
    card.className = "style-card";

    card.innerHTML = `
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

renderCards(mockData);
