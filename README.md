# Nifty 50 Tracker App

A lightweight browser-based tracker for Nifty 50 stocks.

## Features

- Nifty 50 stock table with symbol, company, price, and percentage move.
- Quick search by symbol/company with visible result count.
- Clear empty-state message when no stocks match your search.
- Watchlist toggle saved in browser local storage.
- Summary cards for index estimate, advances/declines, and watchlist value.
- Refresh button to simulate market movement and update a visible timestamp.

## Run locally

Because this is a static app, you can open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
