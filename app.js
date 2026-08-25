// ======================================================
// V2 QUANT PORTFOLIO ENGINE
// GitHub Pages compatible
// Paper portfolio only
// ======================================================

const CONFIG = {
  portfolioSize: 12,
  replacementThreshold: 7,

  weights: {
    technical: 0.22,
    trend: 0.14,
    momentum: 0.12,
    volume: 0.10,
    news: 0.16,
    catalyst: 0.10,
    relativeStrength: 0.10,
    upside: 0.12,
    riskPenalty: 0.06
  }
};

// ======================================================
// DEMO MARKET REGIME
// Later replace with live SPY / QQQ / VIX / 10Y data
// ======================================================

const market = {
  regime: "SELECTIVE RISK-ON",
  score: 68,

  spy: {
    trend: "Bullish"
  },

  qqq: {
    trend: "Bullish"
  },

  vix: 17.8,

  yield10Y: 3.91
};

// ======================================================
// STOCK UNIVERSE
//
// Replace/update this data later from API.
// closes = historical closing prices.
// ======================================================

const stockDatabase = {

  NVDA: {
    company: "NVIDIA",
    sector: "Semiconductors",
    price: 184.50,
    closes: generateSeries(151, 184.5, 80, 4),
    volumeRatio: 1.45,
    newsScore: 85,
    catalystScore: 90,
    relativeStrength: 88,
    upsidePotential: 78,
    riskScore: 38,
    catalyst: "AI demand / earnings"
  },

  COHR: {
    company: "Coherent",
    sector: "AI Infrastructure",
    price: 286.40,
    closes: generateSeries(225, 286.4, 80, 8),
    volumeRatio: 1.80,
    newsScore: 82,
    catalystScore: 88,
    relativeStrength: 91,
    upsidePotential: 90,
    riskScore: 46,
    catalyst: "Optical networking / AI datacenter"
  },

  USAR: {
    company: "USA Rare Earth",
    sector: "Rare Earth",
    price: 18.37,
    closes: generateSeries(15, 18.37, 80, 1.6),
    volumeRatio: 2.10,
    newsScore: 91,
    catalystScore: 94,
    relativeStrength: 76,
    upsidePotential: 96,
    riskScore: 72,
    catalyst: "Strategic rare-earth catalyst"
  },

  AMD: {
    company: "AMD",
    sector: "Semiconductors",
    price: 212.10,
    closes: generateSeries(174, 212.1, 80, 5),
    volumeRatio: 1.30,
    newsScore: 79,
    catalystScore: 81,
    relativeStrength: 84,
    upsidePotential: 82,
    riskScore: 41,
    catalyst: "AI accelerator demand"
  },

  MU: {
    company: "Micron",
    sector: "Memory",
    price: 163.20,
    closes: generateSeries(125, 163.2, 80, 5),
    volumeRatio: 1.55,
    newsScore: 84,
    catalystScore: 88,
    relativeStrength: 90,
    upsidePotential: 85,
    riskScore: 45,
    catalyst: "HBM / memory cycle"
  },

  AVGO: {
    company: "Broadcom",
    sector: "Semiconductors",
    price: 326,
    closes: generateSeries(255, 326, 80, 7),
    volumeRatio: 1.22,
    newsScore: 86,
    catalystScore: 87,
    relativeStrength: 88,
    upsidePotential: 72,
    riskScore: 32,
    catalyst: "AI networking"
  },

  AMAT: {
    company: "Applied Materials",
    sector: "Semiconductor Equipment",
    price: 228,
    closes: generateSeries(195, 228, 80, 5),
    volumeRatio: 1.18,
    newsScore: 74,
    catalystScore: 75,
    relativeStrength: 77,
    upsidePotential: 74,
    riskScore: 36,
    catalyst: "Semiconductor capex"
  },

  ARM: {
    company: "Arm Holdings",
    sector: "Semiconductors",
    price: 147,
    closes: generateSeries(116, 147, 80, 6),
    volumeRatio: 1.42,
    newsScore: 80,
    catalystScore: 83,
    relativeStrength: 81,
    upsidePotential: 86,
    riskScore: 58,
    catalyst: "AI / CPU architecture"
  },

  PLTR: {
    company: "Palantir",
    sector: "AI Software",
    price: 171,
    closes: generateSeries(129, 171, 80, 6),
    volumeRatio: 1.62,
    newsScore: 83,
    catalystScore: 85,
    relativeStrength: 94,
    upsidePotential: 69,
    riskScore: 53,
    catalyst: "AI software growth"
  },

  IREN: {
    company: "IREN",
    sector: "AI Infrastructure",
    price: 31.4,
    closes: generateSeries(21, 31.4, 80, 2.1),
    volumeRatio: 1.88,
    newsScore: 80,
    catalystScore: 86,
    relativeStrength: 89,
    upsidePotential: 94,
    riskScore: 70,
    catalyst: "AI datacenter expansion"
  },

  NBIS: {
    company: "Nebius",
    sector: "AI Infrastructure",
    price: 82,
    closes: generateSeries(60, 82, 80, 5),
    volumeRatio: 1.48,
    newsScore: 81,
    catalystScore: 85,
    relativeStrength: 87,
    upsidePotential: 91,
    riskScore: 61,
    catalyst: "AI cloud expansion"
  },

  STRL: {
    company: "Sterling Infrastructure",
    sector: "Infrastructure",
    price: 342,
    closes: generateSeries(263, 342, 80, 9),
    volumeRatio: 1.25,
    newsScore: 77,
    catalystScore: 82,
    relativeStrength: 91,
    upsidePotential: 75,
    riskScore: 39,
    catalyst: "Datacenter infrastructure"
  },

  BE: {
    company: "Bloom Energy",
    sector: "Energy",
    price: 94,
    closes: generateSeries(69, 94, 80, 4),
    volumeRatio: 1.92,
    newsScore: 84,
    catalystScore: 88,
    relativeStrength: 85,
    upsidePotential: 89,
    riskScore: 62,
    catalyst: "Datacenter power demand"
  },

  MP: {
    company: "MP Materials",
    sector: "Rare Earth",
    price: 76,
    closes: generateSeries(56, 76, 80, 3.5),
    volumeRatio: 1.28,
    newsScore: 85,
    catalystScore: 90,
    relativeStrength: 82,
    upsidePotential: 80,
    riskScore: 48,
    catalyst: "US rare-earth supply chain"
  },

  RKLB: {
    company: "Rocket Lab",
    sector: "Space",
    price: 64,
    closes: generateSeries(45, 64, 80, 3),
    volumeRatio: 1.52,
    newsScore: 78,
    catalystScore: 84,
    relativeStrength: 86,
    upsidePotential: 92,
    riskScore: 71,
    catalyst: "Launch / defense growth"
  },

  TEM: {
    company: "Tempus AI",
    sector: "AI Healthcare",
    price: 89,
    closes: generateSeries(63, 89, 80, 4),
    volumeRatio: 1.38,
    newsScore: 78,
    catalystScore: 83,
    relativeStrength: 84,
    upsidePotential: 90,
    riskScore: 67,
    catalyst: "AI healthcare growth"
  }

};

// ======================================================
// TEST DATA GENERATOR
// ======================================================

function generateSeries(start, end, length = 80, volatility = 3) {

  const data = [];

  for (let i = 0; i < length; i++) {

    const progress =
      i / (length - 1);

    const trend =
      start +
      (end - start) * progress;

    const noise =
      Math.sin(i * 0.8) *
      volatility;

    data.push(
      Math.max(
        0.01,
        trend + noise
      )
    );
  }

  data[data.length - 1] =
    end;

  return data;
}

// ======================================================
// EMA
// ======================================================

function emaSeries(data, period) {

  const multiplier =
    2 / (period + 1);

  const result = [];

  let ema =
    data[0];

  result.push(ema);

  for (let i = 1; i < data.length; i++) {

    ema =
      data[i] * multiplier +
      ema * (1 - multiplier);

    result.push(ema);
  }

  return result;
}

function EMA(data, period) {

  const series =
    emaSeries(data, period);

  return series[
    series.length - 1
  ];
}

// ======================================================
// RSI
// ======================================================

function RSI(data, period = 14) {

  if (
    data.length <= period
  ) return 50;

  let gain = 0;
  let loss = 0;

  for (
    let i = 1;
    i <= period;
    i++
  ) {

    const diff =
      data[i] -
      data[i - 1];

    if (diff >= 0)
      gain += diff;
    else
      loss += Math.abs(diff);
  }

  let avgGain =
    gain / period;

  let avgLoss =
    loss / period;

  for (
    let i = period + 1;
    i < data.length;
    i++
  ) {

    const diff =
      data[i] -
      data[i - 1];

    const currentGain =
      Math.max(diff, 0);

    const currentLoss =
      Math.max(-diff, 0);

    avgGain =
      (
        avgGain *
        (period - 1) +
        currentGain
      ) / period;

    avgLoss =
      (
        avgLoss *
        (period - 1) +
        currentLoss
      ) / period;
  }

  if (
    avgLoss === 0
  ) return 100;

  const rs =
    avgGain / avgLoss;

  return (
    100 -
    100 / (1 + rs)
  );
}

// ======================================================
// MACD
// ======================================================

function MACD(data) {

  const fast =
    emaSeries(data, 12);

  const slow =
    emaSeries(data, 26);

  const macdSeries =
    data.map(
      (_, i) =>
        fast[i] -
        slow[i]
    );

  const signalSeries =
    emaSeries(
      macdSeries,
      9
    );

  const index =
    macdSeries.length - 1;

  return {
    macd:
      macdSeries[index],

    signal:
      signalSeries[index],

    histogram:
      macdSeries[index] -
      signalSeries[index]
  };
}

// ======================================================
// TECHNICAL SCORE
// ======================================================

function calculateTechnical(stock) {

  const closes =
    stock.closes;

  const price =
    stock.price;

  const rsi =
    RSI(closes);

  const macd =
    MACD(closes);

  const ema9 =
    EMA(closes, 9);

  const ema20 =
    EMA(closes, 20);

  const ema50 =
    EMA(closes, 50);

  const ema200 =
    closes.length >= 200
      ? EMA(closes, 200)
      : null;

  // RSI score
  let rsiScore = 50;

  if (
    rsi >= 45 &&
    rsi <= 65
  )
    rsiScore = 90;

  else if (
    rsi >= 35 &&
    rsi < 45
  )
    rsiScore = 82;

  else if (
    rsi > 65 &&
    rsi <= 72
  )
    rsiScore = 72;

  else if (
    rsi > 75
  )
    rsiScore = 42;

  else if (
    rsi < 30
  )
    rsiScore = 50;

  // MACD score
  let macdScore = 45;

  if (
    macd.macd >
    macd.signal &&
    macd.histogram > 0
  )
    macdScore = 90;

  else if (
    macd.histogram >
    -0.02
  )
    macdScore = 70;

  // EMA trend score
  let trendScore = 35;

  if (
    price > ema9 &&
    ema9 > ema20 &&
    ema20 > ema50
  )
    trendScore = 95;

  else if (
    price > ema20 &&
    ema20 > ema50
  )
    trendScore = 88;

  else if (
    price > ema20
  )
    trendScore = 72;

  else if (
    price > ema50
  )
    trendScore = 58;

  const technical =
    (
      rsiScore * 0.35 +
      macdScore * 0.35 +
      trendScore * 0.30
    );

  return {
    technical,
    rsi,
    rsiScore,
    macd,
    macdScore,
    ema9,
    ema20,
    ema50,
    ema200,
    trendScore
  };
}

// ======================================================
// MOMENTUM
// ======================================================

function calculateMomentum(
  closes
) {

  const last =
    closes.length - 1;

  const current =
    closes[last];

  const five =
    closes[
      Math.max(0, last - 5)
    ];

  const twenty =
    closes[
      Math.max(0, last - 20)
    ];

  const return5 =
    (
      current / five - 1
    ) * 100;

  const return20 =
    (
      current / twenty - 1
    ) * 100;

  let score =
    50 +
    return5 * 3 +
    return20 * 1.5;

  score =
    clamp(score, 0, 100);

  return {
    return5,
    return20,
    score
  };
}

// ======================================================
// VOLUME SCORE
// ======================================================

function volumeScore(
  relativeVolume
) {

  if (relativeVolume >= 2)
    return 95;

  if (relativeVolume >= 1.5)
    return 85;

  if (relativeVolume >= 1.2)
    return 72;

  if (relativeVolume >= 1)
    return 60;

  return 40;
}

// ======================================================
// QUANT ENGINE
// ======================================================

function calculateQuant(
  ticker,
  stock
) {

  const tech =
    calculateTechnical(stock);

  const momentum =
    calculateMomentum(
      stock.closes
    );

  const volume =
    volumeScore(
      stock.volumeRatio
    );

  const trend =
    tech.trendScore;

  const riskPenalty =
    stock.riskScore;

  let score =

    tech.technical *
    CONFIG.weights.technical +

    trend *
    CONFIG.weights.trend +

    momentum.score *
    CONFIG.weights.momentum +

    volume *
    CONFIG.weights.volume +

    stock.newsScore *
    CONFIG.weights.news +

    stock.catalystScore *
    CONFIG.weights.catalyst +

    stock.relativeStrength *
    CONFIG.weights.relativeStrength +

    stock.upsidePotential *
    CONFIG.weights.upside -

    riskPenalty *
    CONFIG.weights.riskPenalty;

  // Market regime adjustment

  score +=
    (
      market.score - 50
    ) * 0.08;

  score =
    clamp(score, 0, 100);

  const confidence =
    calculateConfidence(
      stock,
      tech,
      momentum
    );

  return {
    ticker,
    ...stock,
    ...tech,
    momentum,
    volumeScore: volume,
    quantScore:
      Math.round(score),
    confidence:
      Math.round(confidence)
  };
}

// ======================================================
// CONFIDENCE
// ======================================================

function calculateConfidence(
  stock,
  tech,
  momentum
) {

  let confirmation = 0;

  let count = 0;

  const factors = [

    tech.rsiScore,

    tech.macdScore,

    tech.trendScore,

    stock.newsScore,

    stock.catalystScore,

    stock.relativeStrength,

    momentum.score

  ];

  factors.forEach(
    value => {

      confirmation += value;
      count++;

    }
  );

  let confidence =
    confirmation / count;

  confidence -=
    stock.riskScore * 0.12;

  return clamp(
    confidence,
    0,
    100
  );
}

// ======================================================
// EXPECTED OPPORTUNITY
//
// High upside alone should NOT win.
// ======================================================

function expectedOpportunity(
  stock
) {

  const probability =
    stock.confidence / 100;

  const upside =
    stock.upsidePotential;

  const risk =
    stock.riskScore;

  return (
    upside *
    probability *
    (
      1 -
      risk / 180
    )
  );
}

// ======================================================
// SIGNAL
// ======================================================

function getSignal(score) {

  if (score >= 90)
    return "ELITE SETUP";

  if (score >= 80)
    return "STRONG SETUP";

  if (score >= 70)
    return "BULLISH WATCH";

  if (score >= 60)
    return "WATCH";

  if (score >= 45)
    return "NEUTRAL";

  if (score >= 30)
    return "WEAK";

  return "AVOID";
}

// ======================================================
// POSITION ROLE
// ======================================================

function getRole(stock) {

  if (
    stock.quantScore >= 88 &&
    stock.confidence >= 78
  )
    return "HIGH CONVICTION";

  if (
    stock.quantScore >= 80 &&
    stock.riskScore <= 50
  )
    return "CORE";

  if (
    stock.quantScore >= 74
  )
    return "TACTICAL";

  if (
    stock.quantScore >= 65
  )
    return "WATCH";

  return "REMOVE CANDIDATE";
}

// ======================================================
// POSITION WEIGHT
// ======================================================

function calculateWeights(
  holdings
) {

  const raw =
    holdings.map(stock => {

      const conviction =
        stock.quantScore *
        (
          stock.confidence / 100
        ) *
        (
          1 -
          stock.riskScore / 150
        );

      return Math.max(
        conviction,
        10
      );
    });

  const total =
    raw.reduce(
      (a, b) => a + b,
      0
    );

  return raw.map(
    value =>
      value / total * 100
  );
}

// ======================================================
// RUN STOCK SCANNER
// ======================================================

function runScanner() {

  return Object
    .entries(stockDatabase)

    .map(
      ([ticker, stock]) => {

        const result =
          calculateQuant(
            ticker,
            stock
          );

        result.expectedOpportunity =
          expectedOpportunity(
            result
          );

        result.signal =
          getSignal(
            result.quantScore
          );

        result.role =
          getRole(result);

        return result;
      }
    )

    .sort(
      (a, b) => {

        const scoreDifference =
          b.quantScore -
          a.quantScore;

        if (
          Math.abs(
            scoreDifference
          ) >= 2
        )
          return scoreDifference;

        return (
          b.expectedOpportunity -
          a.expectedOpportunity
        );
      }
    );
}

// ======================================================
// BUILD 12-STOCK PORTFOLIO
// ======================================================

function buildPortfolio() {

  const scanner =
    runScanner();

  const selected =
    scanner.slice(
      0,
      CONFIG.portfolioSize
    );

  const weights =
    calculateWeights(
      selected
    );

  selected.forEach(
    (stock, index) => {

      stock.weight =
        weights[index];

    }
  );

  return {
    selected,
    candidates:
      scanner.slice(
        CONFIG.portfolioSize
      )
  };
}

// ======================================================
// PORTFOLIO SIMULATION STORAGE
// ======================================================

const STORAGE_KEY =
  "quantPortfolioV2";

function getSavedPortfolio() {

  const raw =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!raw)
    return null;

  try {

    return JSON.parse(raw);

  } catch {

    return null;
  }
}

function savePortfolio(
  portfolio
) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(portfolio)
  );
}

// ======================================================
// REBALANCE
// ======================================================

function rebalancePortfolio() {

  const newPortfolio =
    buildPortfolio();

  const previous =
    getSavedPortfolio();

  const changes = [];

  if (previous) {

    const previousTickers =
      previous.selected.map(
        x => x.ticker
      );

    const newTickers =
      newPortfolio.selected.map(
        x => x.ticker
      );

    previousTickers
      .filter(
        ticker =>
          !newTickers.includes(
            ticker
          )
      )
      .forEach(
        ticker => {

          changes.push({
            ticker,
            action: "REMOVE"
          });

        }
      );

    newTickers
      .filter(
        ticker =>
          !previousTickers.includes(
            ticker
          )
      )
      .forEach(
        ticker => {

          changes.push({
            ticker,
            action: "ADD"
          });

        }
      );
  }

  newPortfolio.timestamp =
    new Date()
      .toISOString();

  savePortfolio(
    newPortfolio
  );

  renderPortfolio(
    newPortfolio,
    changes
  );

  renderScanner(
    runScanner()
  );
}

// ======================================================
// THESIS
// ======================================================

function generateReasons(
  stock
) {

  const positives = [];

  const risks = [];

  if (
    stock.price >
    stock.ema20
  )
    positives.push(
      "Price above EMA20"
    );

  if (
    stock.ema20 >
    stock.ema50
  )
    positives.push(
      "EMA20 above EMA50"
    );

  if (
    stock.macd.macd >
    stock.macd.signal
  )
    positives.push(
      "MACD bullish"
    );

  if (
    stock.rsi >= 40 &&
    stock.rsi <= 65
  )
    positives.push(
      "Healthy RSI"
    );

  if (
    stock.volumeRatio >= 1.5
  )
    positives.push(
      `High relative volume ${stock.volumeRatio.toFixed(1)}x`
    );

  if (
    stock.newsScore >= 80
  )
    positives.push(
      "Strong news support"
    );

  if (
    stock.catalystScore >= 85
  )
    positives.push(
      stock.catalyst
    );

  if (
    stock.relativeStrength >= 85
  )
    positives.push(
      "Strong relative strength"
    );

  if (
    stock.riskScore >= 65
  )
    risks.push(
      "High volatility / event risk"
    );

  if (
    stock.rsi > 72
  )
    risks.push(
      "RSI elevated"
    );

  if (
    stock.price <
    stock.ema20
  )
    risks.push(
      "Price below EMA20"
    );

  return {
    positives,
    risks
  };
}

// ======================================================
// PORTFOLIO RENDERER
// ======================================================

function renderPortfolio(
  portfolio,
  changes = []
) {

  const container =
    document.getElementById(
      "portfolioBody"
    );

  if (!container)
    return;

  container.innerHTML = "";

  portfolio.selected
    .forEach(
      (stock, index) => {

        const reasons =
          generateReasons(stock);

        const row =
          document.createElement(
            "tr"
          );

        row.innerHTML = `

          <td>
            <strong>
              #${index + 1}
            </strong>
          </td>

          <td>
            <strong>
              ${stock.ticker}
            </strong>

            <small class="company-name">
              ${stock.company}
            </small>
          </td>

          <td>
            $${stock.price.toFixed(2)}
          </td>

          <td>
            ${stock.quantScore}
          </td>

          <td>
            ${stock.confidence}%
          </td>

          <td>
            ${stock.upsidePotential}
          </td>

          <td>
            ${stock.riskScore}
          </td>

          <td>
            ${stock.weight.toFixed(1)}%
          </td>

          <td>
            ${stock.role}
          </td>

          <td>
            ${stock.signal}
          </td>

        `;

        row.onclick =
          () =>
            showStockDetails(
              stock
            );

        container.appendChild(
          row
        );
      }
    );

  renderPortfolioChanges(
    changes
  );
}

// ======================================================
// CHANGES
// ======================================================

function renderPortfolioChanges(
  changes
) {

  const box =
    document.getElementById(
      "rotationLog"
    );

  if (!box)
    return;

  if (
    changes.length === 0
  ) {

    box.innerHTML =
      "No portfolio rotation detected.";

    return;
  }

  box.innerHTML =
    changes
      .map(change => {

        const symbol =
          change.action === "ADD"
            ? "+"
            : "−";

        return `
          <div>
            ${symbol}
            <strong>
              ${change.ticker}
            </strong>

            ${change.action}
          </div>
        `;

      })
      .join("");
}

// ======================================================
// SCANNER TABLE
// ======================================================

function renderScanner(
  scanner
) {

  const body =
    document.getElementById(
      "scannerBody"
    );

  if (!body)
    return;

  body.innerHTML = "";

  scanner.forEach(
    (stock, index) => {

      const row =
        document.createElement(
          "tr"
        );

      row.innerHTML = `

        <td>
          ${index + 1}
        </td>

        <td>
          <strong>
            ${stock.ticker}
          </strong>
        </td>

        <td>
          ${stock.sector}
        </td>

        <td>
          ${stock.quantScore}
        </td>

        <td>
          ${stock.confidence}%
        </td>

        <td>
          ${stock.rsi.toFixed(1)}
        </td>

        <td>
          ${
            stock.macd.macd >
            stock.macd.signal
              ? "Bullish"
              : "Bearish"
          }
        </td>

        <td>
          ${stock.volumeRatio.toFixed(2)}x
        </td>

        <td>
          ${stock.relativeStrength}
        </td>

        <td>
          ${stock.upsidePotential}
        </td>

        <td>
          ${stock.riskScore}
        </td>

        <td>
          ${stock.signal}
        </td>

      `;

      row.onclick =
        () =>
          showStockDetails(
            stock
          );

      body.appendChild(
        row
      );
    }
  );
}

// ======================================================
// STOCK DETAIL
// ======================================================

function showStockDetails(
  stock
) {

  const modal =
    document.getElementById(
      "stockDetail"
    );

  if (!modal)
    return;

  const reasons =
    generateReasons(stock);

  modal.classList.remove(
    "hidden"
  );

  modal.innerHTML = `

    <div class="detail-header">

      <div>

        <p class="eyebrow">
          QUANT ANALYSIS
        </p>

        <h2>
          ${stock.ticker}
        </h2>

        <p>
          ${stock.company}
        </p>

      </div>

      <button
        onclick="closeStockDetails()"
      >
        ✕
      </button>

    </div>


    <div class="detail-score">

      <div>
        <span>Quant</span>
        <strong>
          ${stock.quantScore}
        </strong>
      </div>

      <div>
        <span>Confidence</span>
        <strong>
          ${stock.confidence}%
        </strong>
      </div>

      <div>
        <span>Upside</span>
        <strong>
          ${stock.upsidePotential}
        </strong>
      </div>

      <div>
        <span>Risk</span>
        <strong>
          ${stock.riskScore}
        </strong>
      </div>

    </div>


    <h3>
      Technical
    </h3>

    <p>
      RSI:
      ${stock.rsi.toFixed(1)}
    </p>

    <p>
      MACD:
      ${stock.macd.macd.toFixed(3)}
    </p>

    <p>
      Signal:
      ${stock.macd.signal.toFixed(3)}
    </p>

    <p>
      EMA 9:
      ${stock.ema9.toFixed(2)}
    </p>

    <p>
      EMA 20:
      ${stock.ema20.toFixed(2)}
    </p>

    <p>
      EMA 50:
      ${stock.ema50.toFixed(2)}
    </p>


    <h3>
      Catalyst
    </h3>

    <p>
      ${stock.catalyst}
    </p>


    <h3>
      Why Quant Likes It
    </h3>

    <ul>

      ${
        reasons.positives
          .map(
            x =>
              `<li>${x}</li>`
          )
          .join("")
      }

    </ul>


    <h3>
      Risk Factors
    </h3>

    ${
      reasons.risks.length

      ?

      `<ul>
        ${
          reasons.risks
            .map(
              x =>
                `<li>${x}</li>`
            )
            .join("")
        }
      </ul>`

      :

      "<p>No major technical warning detected.</p>"
    }

  `;
}

function closeStockDetails() {

  const modal =
    document.getElementById(
      "stockDetail"
    );

  modal.classList.add(
    "hidden"
  );
}

// ======================================================
// MARKET
// ======================================================

function renderMarket() {

  setText(
    "marketRegime",
    market.regime
  );

  setText(
    "marketScore",
    market.score
  );

  setText(
    "spyTrend",
    market.spy.trend
  );

  setText(
    "qqqTrend",
    market.qqq.trend
  );

  setText(
    "vixValue",
    market.vix
  );

  setText(
    "yieldValue",
    market.yield10Y + "%"
  );
}

// ======================================================
// HELPERS
// ======================================================

function clamp(
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );
}

function setText(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );

  if (element)
    element.innerText =
      value;
}

// ======================================================
// START
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderMarket();

    rebalancePortfolio();

  }
);
