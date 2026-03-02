const stocks = [
  ["RELIANCE", "Reliance Industries"], ["TCS", "Tata Consultancy Services"], ["HDFCBANK", "HDFC Bank"],
  ["ICICIBANK", "ICICI Bank"], ["INFY", "Infosys"], ["HINDUNILVR", "Hindustan Unilever"],
  ["ITC", "ITC Ltd"], ["LT", "Larsen & Toubro"], ["SBIN", "State Bank of India"],
  ["BHARTIARTL", "Bharti Airtel"], ["KOTAKBANK", "Kotak Mahindra Bank"], ["BAJFINANCE", "Bajaj Finance"],
  ["ASIANPAINT", "Asian Paints"], ["HCLTECH", "HCL Technologies"], ["SUNPHARMA", "Sun Pharma"],
  ["MARUTI", "Maruti Suzuki"], ["AXISBANK", "Axis Bank"], ["WIPRO", "Wipro"], ["ULTRACEMCO", "UltraTech Cement"],
  ["TITAN", "Titan Company"], ["NESTLEIND", "Nestle India"], ["BAJAJFINSV", "Bajaj Finserv"],
  ["M&M", "Mahindra & Mahindra"], ["POWERGRID", "Power Grid Corp"], ["NTPC", "NTPC"],
  ["JSWSTEEL", "JSW Steel"], ["TATAMOTORS", "Tata Motors"], ["TATASTEEL", "Tata Steel"],
  ["ADANIPORTS", "Adani Ports"], ["COALINDIA", "Coal India"], ["ONGC", "ONGC"],
  ["TECHM", "Tech Mahindra"], ["HDFCLIFE", "HDFC Life"], ["INDUSINDBK", "IndusInd Bank"],
  ["DRREDDY", "Dr Reddy's Labs"], ["CIPLA", "Cipla"], ["DIVISLAB", "Divi's Laboratories"],
  ["HEROMOTOCO", "Hero MotoCorp"], ["BRITANNIA", "Britannia"], ["APOLLOHOSP", "Apollo Hospitals"],
  ["BPCL", "BPCL"], ["EICHERMOT", "Eicher Motors"], ["GRASIM", "Grasim"], ["SBILIFE", "SBI Life"],
  ["UPL", "UPL"], ["ADANIENT", "Adani Enterprises"], ["SHRIRAMFIN", "Shriram Finance"],
  ["BAJAJ-AUTO", "Bajaj Auto"], ["HINDALCO", "Hindalco"], ["PIDILITIND", "Pidilite Industries"]
].map(([symbol, company], index) => ({
  symbol,
  company,
  price: Number((400 + index * 38.5).toFixed(2)),
  change: Number((((index % 7) - 3) * 1.75).toFixed(2))
}));

const watchSet = new Set(JSON.parse(localStorage.getItem("nifty-watch") || "[]"));
const rowsRoot = document.getElementById("stockRows");
const search = document.getElementById("search");
const resultCount = document.getElementById("resultCount");
const lastUpdated = document.getElementById("lastUpdated");

const money = (n) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function renderRows() {
  const term = search.value.trim().toLowerCase();
  const filtered = stocks
    .filter((s) => s.symbol.toLowerCase().includes(term) || s.company.toLowerCase().includes(term))
    .sort((a, b) => b.price - a.price);

  rowsRoot.innerHTML = "";

  if (filtered.length === 0) {
    rowsRoot.innerHTML = `<tr><td class="empty-state" colspan="6">No stocks found for "${search.value.trim()}".</td></tr>`;
  }

  filtered.forEach((stock) => {
    const pct = ((stock.change / (stock.price - stock.change)) * 100).toFixed(2);
    const up = stock.change >= 0;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${stock.symbol}</strong></td>
      <td>${stock.company}</td>
      <td>${money(stock.price)}</td>
      <td class="change ${up ? "up" : "down"}">${up ? "+" : ""}${stock.change.toFixed(2)}</td>
      <td class="pct ${up ? "up" : "down"}">${up ? "+" : ""}${pct}%</td>
      <td><button class="watch-btn ${watchSet.has(stock.symbol) ? "active" : ""}" data-symbol="${stock.symbol}">
        ${watchSet.has(stock.symbol) ? "Watching" : "Add"}
      </button></td>
    `;
    rowsRoot.appendChild(tr);
  });

  document.querySelectorAll(".watch-btn").forEach((btn) => {
    btn.onclick = () => toggleWatch(btn.dataset.symbol);
  });

  resultCount.textContent = `${filtered.length} of ${stocks.length} stocks visible`;
  renderSummary();
}

function toggleWatch(symbol) {
  if (watchSet.has(symbol)) watchSet.delete(symbol);
  else watchSet.add(symbol);
  localStorage.setItem("nifty-watch", JSON.stringify([...watchSet]));
  renderRows();
}

function renderSummary() {
  const index = stocks.reduce((sum, s) => sum + s.price, 0) / stocks.length;
  const idxChange = stocks.reduce((sum, s) => sum + s.change, 0) / stocks.length;
  const idxPct = ((idxChange / (index - idxChange)) * 100).toFixed(2);

  const adv = stocks.filter((s) => s.change >= 0).length;
  const dec = stocks.length - adv;

  const watchValue = stocks
    .filter((s) => watchSet.has(s.symbol))
    .reduce((sum, s) => sum + s.price, 0);

  document.getElementById("indexPrice").textContent = money(index);
  const indexChangeEl = document.getElementById("indexChange");
  indexChangeEl.textContent = `${idxChange >= 0 ? "+" : ""}${idxChange.toFixed(2)} (${idxChange >= 0 ? "+" : ""}${idxPct}%)`;
  indexChangeEl.className = `change ${idxChange >= 0 ? "up" : "down"}`;

  document.getElementById("breadth").textContent = `${adv} / ${dec}`;
  document.getElementById("watchValue").textContent = money(watchValue);
}

function refreshPrices() {
  stocks.forEach((s) => {
    const delta = Number((Math.random() * 24 - 12).toFixed(2));
    s.price = Number(Math.max(10, s.price + delta).toFixed(2));
    s.change = delta;
  });
  lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString("en-IN")}`;
  renderRows();
}

document.getElementById("refreshBtn").addEventListener("click", refreshPrices);
search.addEventListener("input", renderRows);

lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString("en-IN")}`;
renderRows();
