// =====================================
// QUANT STOCK INTELLIGENCE
// MVP VERSION
// =====================================


// -------------------------------------
// DEMO DATA
// ภายหลังเราจะเปลี่ยนส่วนนี้เป็น Live API
// -------------------------------------

const stockDatabase = {

  NVDA: {
    price: 184.50,

    closes: [
      161,162,164,163,166,168,167,170,171,169,
      172,174,173,176,178,177,179,181,180,182,
      183,181,180,182,181,179,181,182,183,184,
      182,181,183,185,184,186,187,185,184,184.5,
      183,182,184,185,186,184,183,185,184,184.5,
      183,185,186,184,185,184,186,185,184,184.5
    ],

    newsScore: 82
  },


  COHR: {
    price: 286.40,

    closes: [
      250,254,258,262,265,268,270,273,275,278,
      281,283,286,290,294,298,302,305,307,310,
      308,306,303,300,297,294,290,287,285,282,
      280,279,281,283,285,287,289,288,286,286.4,
      285,284,286,287,288,287,286,288,287,286.4,
      285,287,288,287,286,285,287,288,287,286.4
    ],

    newsScore: 76
  },


  USAR: {
    price: 18.37,

    closes: [
      15,15.2,15.5,15.7,16,16.3,16.8,17.2,17.8,18.3,
      18.9,19.4,20,20.8,21.5,22.2,23,24,25,26,
      25,24,23,22,21,20,19.5,19.2,18.9,18.6,
      18.3,18.1,18,17.9,18,18.1,18.2,18.3,18.4,18.37,
      18.2,18.1,18.2,18.3,18.4,18.35,18.3,18.4,18.36,18.37,
      18.31,18.28,18.32,18.36,18.39,18.35,18.34,18.37,18.36,18.37
    ],

    newsScore: 88
  },


  AMD: {
    price: 212.10,

    closes: [
      180,182,185,184,188,190,192,194,193,196,
      198,200,201,199,202,204,206,207,209,208,
      210,211,209,208,210,212,214,213,215,216,
      214,213,211,210,209,208,210,211,212,212.1,
      211,210,212,213,212,211,212,213,212,212.1,
      211,212,213,212,211,212,213,212,211,212.1
    ],

    newsScore: 72
  }

};


// =====================================
// EMA
// =====================================

function calculateEMA(data, period) {

  const multiplier = 2 / (period + 1);

  let ema = data[0];

  for (let i = 1; i < data.length; i++) {

    ema =
      (data[i] * multiplier) +
      (ema * (1 - multiplier));

  }

  return ema;
}


// =====================================
// EMA SERIES
// ใช้สำหรับ MACD
// =====================================

function calculateEMASeries(data, period) {

  const multiplier = 2 / (period + 1);

  const result = [];

  let ema = data[0];

  result.push(ema);

  for (let i = 1; i < data.length; i++) {

    ema =
      data[i] * multiplier +
      ema * (1 - multiplier);

    result.push(ema);
  }

  return result;
}


// =====================================
// RSI 14
// =====================================

function calculateRSI(data, period = 14) {

  if (data.length <= period) {
    return 50;
  }

  let gains = 0;
  let losses = 0;


  for (let i = 1; i <= period; i++) {

    const change = data[i] - data[i - 1];

    if (change >= 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }


  let averageGain = gains / period;
  let averageLoss = losses / period;


  for (let i = period + 1; i < data.length; i++) {

    const change =
      data[i] - data[i - 1];

    const gain =
      change > 0 ? change : 0;

    const loss =
      change < 0 ? Math.abs(change) : 0;


    averageGain =
      (
        averageGain * (period - 1) +
        gain
      ) / period;


    averageLoss =
      (
        averageLoss * (period - 1) +
        loss
      ) / period;
  }


  if (averageLoss === 0) {
    return 100;
  }


  const rs =
    averageGain / averageLoss;


  return (
    100 -
    (100 / (1 + rs))
  );
}


// =====================================
// MACD 12 / 26 / 9
// =====================================

function calculateMACD(data) {

  const ema12 =
    calculateEMASeries(data, 12);

  const ema26 =
    calculateEMASeries(data, 26);


  const macdSeries =
    data.map(
      (_, index) =>
        ema12[index] - ema26[index]
    );


  const signalSeries =
    calculateEMASeries(
      macdSeries,
      9
    );


  const last =
    macdSeries.length - 1;


  return {

    macd:
      macdSeries[last],

    signal:
      signalSeries[last],

    histogram:
      macdSeries[last] -
      signalSeries[last]

  };
}


// =====================================
// SCORE RSI
// =====================================

function scoreRSI(rsi) {

  // Oversold แต่ไม่ extreme
  if (rsi >= 35 && rsi <= 50)
    return 90;

  if (rsi > 50 && rsi <= 65)
    return 80;

  if (rsi > 65 && rsi <= 72)
    return 60;

  if (rsi < 30)
    return 55;

  if (rsi > 75)
    return 25;

  return 65;
}


// =====================================
// SCORE MACD
// =====================================

function scoreMACD(macd) {

  if (
    macd.macd > macd.signal &&
    macd.histogram > 0
  ) {
    return 90;
  }


  if (
    macd.histogram > -0.05
  ) {
    return 65;
  }


  return 35;
}


// =====================================
// SCORE EMA TREND
// =====================================

function scoreTrend(
  price,
  ema20,
  ema50
) {

  if (
    price > ema20 &&
    ema20 > ema50
  ) {
    return 95;
  }


  if (
    price > ema20
  ) {
    return 75;
  }


  if (
    price > ema50
  ) {
    return 60;
  }


  return 30;
}


// =====================================
// MARKET REGIME
// Demo value
// ภายหลังต่อ SPY / QQQ / VIX / Yield
// =====================================

const market = {

  spyTrend: "Bullish",

  qqqTrend: "Neutral",

  vix: 17.8,

  yield10Y: 3.91,

  score: 72

};


// =====================================
// FINAL QUANT SCORE
// =====================================

function calculateQuant(stock) {

  const data =
    stock.closes;


  const price =
    stock.price;


  const rsi =
    calculateRSI(data);


  const ema20 =
    calculateEMA(data, 20);


  const ema50 =
    calculateEMA(data, 50);


  const macd =
    calculateMACD(data);


  const rsiScore =
    scoreRSI(rsi);


  const macdScore =
    scoreMACD(macd);


  const trendScore =
    scoreTrend(
      price,
      ema20,
      ema50
    );


  const newsScore =
    stock.newsScore;


  const regimeScore =
    market.score;


  // -----------------------------
  // WEIGHTS
  // News = 30%
  // MACD = 20%
  // RSI = 15%
  // EMA = 25%
  // Market = 10%
  // -----------------------------

  const finalScore =

    newsScore * 0.30 +

    macdScore * 0.20 +

    rsiScore * 0.15 +

    trendScore * 0.25 +

    regimeScore * 0.10;


  return {

    score:
      Math.round(finalScore),

    rsi,

    ema20,

    ema50,

    macd,

    newsScore,

    rsiScore,

    macdScore,

    trendScore,

    regimeScore
  };
}


// =====================================
// SIGNAL ENGINE
// =====================================

function getSignal(score) {

  if (score >= 80) {

    return {
      text: "ACCUMULATE WATCH",
      className: "positive"
    };

  }


  if (score >= 65) {

    return {
      text: "WATCH",
      className: "neutral"
    };

  }


  if (score >= 50) {

    return {
      text: "NEUTRAL",
      className: "neutral"
    };

  }


  return {
    text: "REDUCE / AVOID",
    className: "negative"
  };
}


// =====================================
// ANALYZE TICKER
// =====================================

function analyzeTicker() {

  const ticker =
    document
      .getElementById("tickerInput")
      .value
      .trim()
      .toUpperCase();


  if (!stockDatabase[ticker]) {

    alert(
      "Ticker นี้ยังไม่มีใน Demo Database"
    );

    return;
  }


  displayStock(ticker);
}


function quickAnalyze(ticker) {

  document
    .getElementById("tickerInput")
    .value = ticker;

  displayStock(ticker);
}


// =====================================
// DISPLAY RESULT
// =====================================

function displayStock(ticker) {

  const stock =
    stockDatabase[ticker];


  const q =
    calculateQuant(stock);


  const signal =
    getSignal(q.score);


  document
    .getElementById("resultPanel")
    .classList
    .remove("hidden");


  document
    .getElementById("tickerName")
    .innerText = ticker;


  document
    .getElementById("stockPrice")
    .innerText =
      "$" + stock.price.toFixed(2);


  document
    .getElementById("quantScore")
    .innerText =
      q.score;


  const signalElement =
    document
      .getElementById("signal");


  signalElement.innerText =
    signal.text;


  signalElement.className =
    "signal " +
    signal.className;


  // RSI

  document
    .getElementById("rsiValue")
    .innerText =
      q.rsi.toFixed(1);


  document
    .getElementById("rsiDesc")
    .innerText =
      getRSIDescription(q.rsi);


  // MACD

  document
    .getElementById("macdValue")
    .innerText =
      q.macd.macd.toFixed(3);


  document
    .getElementById("macdDesc")
    .innerText =
      q.macd.macd >
      q.macd.signal
        ? "Bullish Momentum"
        : "Bearish Momentum";


  // EMA

  document
    .getElementById("ema20")
    .innerText =
      q.ema20.toFixed(2);


  document
    .getElementById("ema50")
    .innerText =
      q.ema50.toFixed(2);


  document
    .getElementById("ema20Desc")
    .innerText =
      stock.price > q.ema20
        ? "Price above EMA20"
        : "Price below EMA20";


  document
    .getElementById("ema50Desc")
    .innerText =
      stock.price > q.ema50
        ? "Price above EMA50"
        : "Price below EMA50";


  // Bars

  setBar(
    "newsBar",
    "newsScore",
    q.newsScore
  );


  setBar(
    "macdBar",
    "macdScore",
    q.macdScore
  );


  setBar(
    "rsiBar",
    "rsiScore",
    q.rsiScore
  );


  setBar(
    "trendBar",
    "trendScore",
    q.trendScore
  );


  setBar(
    "marketBar",
    "regimeScore",
    q.regimeScore
  );


  // THESIS

  document
    .getElementById("thesis")
    .innerHTML =
      createThesis(
        ticker,
        stock,
        q
      );
}


// =====================================
// RSI DESCRIPTION
// =====================================

function getRSIDescription(rsi) {

  if (rsi < 30)
    return "Oversold";

  if (rsi < 45)
    return "Recovering from weak momentum";

  if (rsi <= 65)
    return "Healthy momentum";

  if (rsi <= 75)
    return "Strong momentum";

  return "Overbought risk";
}


// =====================================
// SET SCORE BAR
// =====================================

function setBar(
  barID,
  scoreID,
  value
) {

  document
    .getElementById(barID)
    .value = value;


  document
    .getElementById(scoreID)
    .innerText = value;
}


// =====================================
// AUTO THESIS
// =====================================

function createThesis(
  ticker,
  stock,
  q
) {

  let thesis = "";


  if (
    stock.price >
    q.ema20
  ) {

    thesis +=
      "• ราคาอยู่เหนือ EMA20 แสดงว่าโมเมนตัมระยะสั้นค่อนข้างแข็งแรง.<br>";

  } else {

    thesis +=
      "• ราคายังต่ำกว่า EMA20 จึงยังต้องระวังแรงขายระยะสั้น.<br>";

  }


  if (
    q.macd.macd >
    q.macd.signal
  ) {

    thesis +=
      "• MACD อยู่เหนือ Signal Line เป็นสัญญาณ momentum เชิงบวก.<br>";

  } else {

    thesis +=
      "• MACD ยังต่ำกว่า Signal Line การกลับตัวจึงยังไม่ยืนยัน.<br>";

  }


  if (
    q.rsi >= 35 &&
    q.rsi <= 50
  ) {

    thesis +=
      "• RSI อยู่ในโซนที่ Quant มองว่าน่าสนใจสำหรับการจับตาการฟื้นตัว.<br>";

  }


  if (
    q.newsScore >= 80
  ) {

    thesis +=
      "• News sentiment อยู่ในระดับสูงและเป็น catalyst เชิงบวกของโมเดล.<br>";

  }


  if (
    market.score < 50
  ) {

    thesis +=
      "• อย่างไรก็ตาม Market Regime ยังอ่อนแอ จึงควรลดน้ำหนักสัญญาณรายตัว.<br>";

  }


  thesis +=
    `<br><strong>${ticker} Quant Score: ${q.score}/100</strong>`;


  return thesis;
}


// =====================================
// BASIC NEWS SENTIMENT
// =====================================

function analyzeNews() {

  const headline =
    document
      .getElementById("newsInput")
      .value
      .toLowerCase();


  if (!headline) {
    return;
  }


  const positiveWords = [

    "beat",
    "beats",
    "growth",
    "raises",
    "raised",
    "record",
    "strong",
    "surge",
    "profit",
    "approval",
    "contract",
    "partnership",
    "buyback",
    "upgrade",
    "outperform",
    "expansion",
    "government funding"

  ];


  const negativeWords = [

    "miss",
    "misses",
    "cuts",
    "cut",
    "weak",
    "decline",
    "lawsuit",
    "investigation",
    "downgrade",
    "loss",
    "dilution",
    "offering",
    "bankruptcy",
    "fraud",
    "delay",
    "tariff"

  ];


  let score = 50;


  positiveWords.forEach(
    word => {

      if (
        headline.includes(word)
      ) {

        score += 7;

      }

    }
  );


  negativeWords.forEach(
    word => {

      if (
        headline.includes(word)
      ) {

        score -= 7;

      }

    }
  );


  score =
    Math.max(
      0,
      Math.min(
        100,
        score
      )
    );


  let sentiment;


  if (score >= 65) {

    sentiment =
      "POSITIVE";

  } else if (score <= 40) {

    sentiment =
      "NEGATIVE";

  } else {

    sentiment =
      "NEUTRAL";

  }


  const box =
    document
      .getElementById("newsResult");


  box.classList
    .remove("hidden");


  box.innerHTML = `

    <strong>
      Sentiment:
      ${sentiment}
    </strong>

    <br><br>

    News Score:
    ${score}/100

    <br><br>

    <small>
      เวอร์ชันนี้ใช้ keyword model
      และยังไม่ใช่ AI NLP เต็มรูปแบบ
    </small>

  `;
}


// =====================================
// SCANNER
// =====================================

function loadScanner() {

  const body =
    document
      .getElementById(
        "scannerBody"
      );


  body.innerHTML = "";


  const results =
    Object
      .keys(stockDatabase)
      .map(ticker => {

        const stock =
          stockDatabase[ticker];

        const q =
          calculateQuant(stock);

        return {
          ticker,
          stock,
          q
        };

      });


  // Sort highest score first

  results.sort(
    (a, b) =>
      b.q.score -
      a.q.score
  );


  results.forEach(
    item => {

      const signal =
        getSignal(
          item.q.score
        );


      const trend =
        item.stock.price >
        item.q.ema20
          ? "Bullish"
          : "Weak";


      const row =
        document
          .createElement("tr");


      row.innerHTML = `

        <td>
          <strong>
            ${item.ticker}
          </strong>
        </td>

        <td>
          $${item.stock.price.toFixed(2)}
        </td>

        <td>
          ${item.q.rsi.toFixed(1)}
        </td>

        <td>
          ${
            item.q.macd.macd >
            item.q.macd.signal
              ? "Bullish"
              : "Bearish"
          }
        </td>

        <td>
          ${trend}
        </td>

        <td>
          ${item.q.newsScore}
        </td>

        <td>
          <strong>
            ${item.q.score}
          </strong>
        </td>

        <td
          class="${signal.className}"
        >
          ${signal.text}
        </td>

      `;


      row.onclick =
        () =>
          quickAnalyze(
            item.ticker
          );


      body.appendChild(row);

    }
  );
}


// =====================================
// MARKET
// =====================================

function loadMarket() {

  document
    .getElementById("spyTrend")
    .innerText =
      market.spyTrend;


  document
    .getElementById("qqqTrend")
    .innerText =
      market.qqqTrend;


  document
    .getElementById("vixValue")
    .innerText =
      market.vix;


  document
    .getElementById("yieldValue")
    .innerText =
      market.yield10Y + "%";


  document
    .getElementById("marketScore")
    .innerText =
      market.score;


  if (
    market.score >= 65
  ) {

    document
      .getElementById("marketText")
      .innerText =
        "Risk-On / Constructive";

  } else if (
    market.score >= 45
  ) {

    document
      .getElementById("marketText")
      .innerText =
        "Neutral / Selective";

  } else {

    document
      .getElementById("marketText")
      .innerText =
        "Risk-Off";

  }
}


// =====================================
// START APPLICATION
// =====================================

loadMarket();

loadScanner();
