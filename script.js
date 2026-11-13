// HIERARCHY — A King's Decree
// Initial 16-position court layout

const court = document.getElementById("court");
const placementCounter = document.getElementById("placement-counter");
const positions = [
  [50, 9],
  [42, 25], [58, 25],
  [9, 49], [26, 41], [42, 41],
  [58, 41], [74, 41], [91, 49],
  [26, 57], [42, 57], [58, 57], [74, 57],
  [42, 73], [58, 73],
  [50, 89]
];

positions.forEach((position, index) => {
  const slot = document.createElement("div");
  slot.className = "court-slot";
  slot.dataset.position = index + 1;
  slot.style.left = position[0] + "%";
  slot.style.top = position[1] + "%";
  court.appendChild(slot);
});

// HIERARCHY — 52-card shuffled deck

const suits = ["♠", "♥", "♦", "♣"];
const ranks = ["A", "2", "3", "4", "5", "6", "7",
               "8", "9", "10", "J", "Q", "K"];

const deck = [];

suits.forEach(suit => {
  ranks.forEach((rank, index) => {
    deck.push({ rank, suit, value: index + 1 });
  });
});

// Shuffle the deck
for (let i = deck.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [deck[i], deck[j]] = [deck[j], deck[i]];
}

let currentCard = null;

const drawnCard = document.getElementById("drawn-card");
const drawPile = document.querySelector(".draw-pile");

function drawNextCard() {
  if (currentCard !== null || deck.length === 0) return;

  currentCard = deck.pop();
hasGameStarted = true;
updateActionButton();
  drawnCard.textContent = currentCard.rank + currentCard.suit;
  drawPile.classList.add("is-revealed");
  checkAutomaticDefeat();
  drawnCard.style.color =
    ["♥", "♦"].includes(currentCard.suit) ? "#c62828" : "#222222";
}

if (drawPile && drawnCard) {
  drawPile.style.cursor = "pointer";
  drawPile.addEventListener("click", drawNextCard);
}
// HIERARCHY — Court placement and rank validation
let cardsPlaced = 0;

function isLegalPlacement(slot, card) {
  const x = parseFloat(slot.style.left);
  const y = parseFloat(slot.style.top);

  for (const other of court.querySelectorAll(".court-slot")) {
    if (!other.dataset.value || other === slot) continue;

    const otherX = parseFloat(other.style.left);
    const otherY = parseFloat(other.style.top);
    const otherValue = Number(other.dataset.value);

    // Cards in the same horizontal row:
    // Values increase from left to right.
    if (Math.abs(y - otherY) < 9) {
      if (x < otherX && card.value >= otherValue) return false;
      if (x > otherX && card.value <= otherValue) return false;
    }

    // Cards in the same vertical column:
    // Values increase from bottom to top.
    if (Math.abs(x - otherX) < 9) {
      if (y < otherY && card.value <= otherValue) return false;
      if (y > otherY && card.value >= otherValue) return false;
    }
  }

  return true;
}

function pulseSlot(slot, legal) {
  const originalBorder = slot.style.borderColor;
  const originalShadow = slot.style.boxShadow;

  slot.style.borderColor = legal ? "#55e49a" : "#ff6464";
  slot.style.boxShadow = legal
    ? "0 0 16px #55e49a"
    : "0 0 16px #ff6464";

  setTimeout(() => {
    slot.style.borderColor = originalBorder;
    slot.style.boxShadow = originalShadow;
  }, 550);
}

court.querySelectorAll(".court-slot").forEach(slot => {
  slot.style.cursor = "pointer";

  slot.addEventListener("click", () => {
    if (!currentCard || slot.dataset.value) return;

    const legal = isLegalPlacement(slot, currentCard);
    pulseSlot(slot, legal);

    if (!legal) return;

    slot.dataset.value = currentCard.value;
    slot.textContent = currentCard.rank + currentCard.suit;
    slot.style.color = ["♥", "♦"].includes(currentCard.suit)
      ? "#c62828" : "#222222";
    slot.style.background = "#f8f6f1";
    slot.style.display = "flex";
    slot.style.alignItems = "center";
    slot.style.justifyContent = "center";
    slot.style.fontSize = "clamp(13px, 3vw, 24px)";
    slot.style.fontWeight = "bold";

    cardsPlaced++;
placementCounter.textContent = cardsPlaced;
placementCounter.hidden = false;   
if (["K", "A"].includes(currentCard.rank) && strikes > 0) {
  strikes--;
  royalPardons++;
  const strikeDots = document.querySelectorAll(".strike-dot");
  strikeDots[strikes].classList.remove("used");
  
const originalCardText = slot.textContent;

slot.innerHTML = `
  <span style="font-size:9px;color:#b8860b;">ROYAL</span>
  <span>${originalCardText}</span>
  <span style="font-size:9px;color:#b8860b;">PARDON</span>
`;

slot.style.flexDirection = "column";
slot.style.justifyContent = "space-evenly";
slot.classList.add("royal-pardon");

setTimeout(() => {
  slot.classList.remove("royal-pardon");
}, 1500);

}

if (cardsPlaced === 16) {
  gameOver = true;
  drawPile.style.pointerEvents = "none";
  discardButton.disabled = true;
  showGameEnding("victory");
}
   
    currentCard = null;
    drawnCard.textContent = "?";
    drawPile.classList.remove("is-revealed");
    drawnCard.style.color = "#222222";

  });
});
// HIERARCHY — Discard and three-strike system
let strikes = 0;
let royalPardons = 0;
let discardAnimating = false;
let gameOver = false;

const discardButton = document.getElementById("discard-btn");
let hasGameStarted = false;

function updateActionButton() {
  discardButton.textContent = hasGameStarted ? "DISCARD" : "RULES";
  discardButton.classList.toggle("royal-rejection", hasGameStarted);
}
const strikeDots = document.querySelectorAll(".strike-dot");

discardButton.addEventListener("click", () => {
    if (!currentCard && !gameOver) {
    document.getElementById("rules-btn").click();
    return;
  }
  if (!currentCard || discardAnimating || gameOver) return;

  discardAnimating = true;
  const discardedCard = currentCard;
  currentCard = null;

  drawnCard.classList.add("card-discarding");

  setTimeout(() => {
    drawnCard.classList.remove("card-discarding");
    drawnCard.textContent = "?";
    drawPile.classList.remove("is-revealed");
    drawnCard.style.color = "#222222";

    strikes++;

    document.querySelectorAll(".strike-dot").forEach((dot, index) => {
  dot.classList.toggle("used", index < strikes);
});

    discardAnimating = false;

    if (strikes >= 3) {
      gameOver = true;
      drawPile.style.pointerEvents = "none";
      discardButton.disabled = true;
      showGameEnding("defeat");
    }
  }, 650);
});

// Prevent drawing another card during discard or after game over.
drawPile.removeEventListener("click", drawNextCard);
drawPile.addEventListener("click", () => {
  if (!discardAnimating && !gameOver) drawNextCard();
});


function resetGame() {
  // Restore and reshuffle the deck.
  deck.length = 0;

  suits.forEach(suit => {
    ranks.forEach((rank, index) => {
      deck.push({ rank, suit, value: index + 1 });
    });
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // Clear all 16 court positions.
  court.querySelectorAll(".court-slot").forEach(slot => {
    slot.textContent = "";
    delete slot.dataset.value;
    slot.style.background = "";
    slot.style.color = "";
    slot.style.display = "";
    slot.style.alignItems = "";
    slot.style.justifyContent = "";
    slot.style.fontSize = "";
    slot.style.fontWeight = "";
  });

  // Reset the three strike indicators.
  document.querySelectorAll(".strike-dot").forEach(dot => {
    dot.classList.remove("used");
  });

  cardsPlaced = 0;
 placementCounter.textContent = "";
placementCounter.hidden = true; 
  strikes = 0;
  royalPardons = 0;
  currentCard = null;
  discardAnimating = false;
  gameOver = false;
hasGameStarted = false;
updateActionButton();
  drawnCard.textContent = "";
  drawPile.classList.remove("is-revealed");
  drawnCard.style.color = "#222222";
  drawnCard.classList.remove("card-discarding");

  drawPile.style.pointerEvents = "";
  discardButton.disabled = false;
}
// Victory or defeat, followed by automatic restart.

let toastTimer = null;
let toastResetTimer = null;
const statsKey = "hierarchy-stats-v1";
let toastRemaining = 12;
let gameStats = JSON.parse(localStorage.getItem(statsKey) || "null") || {
  played: 0,
  wins: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalCardsPlaced: 0
};

function recordGameResult(type) {
  gameStats.played++;

  if (type === "victory") {
    gameStats.wins++;
    gameStats.currentStreak++;
    gameStats.bestStreak = Math.max(
      gameStats.bestStreak,
      gameStats.currentStreak
    );
  } else {
    gameStats.currentStreak = 0;
  }

  gameStats.totalCardsPlaced += document.querySelectorAll(
    ".court-slot[data-value]"
  ).length;

  localStorage.setItem(statsKey, JSON.stringify(gameStats));
}
function showGameEnding(type) {
  recordGameResult(type);
  const toast = document.getElementById("game-toast");
  const title = document.getElementById("toast-title");
  const message = document.getElementById("toast-message");
  const seconds = document.getElementById("toast-seconds");

  clearInterval(toastTimer);
  clearTimeout(toastResetTimer);

  title.textContent = type === "victory"
    ? "THE COURT IS YOURS!"
    : "THE KING'S DECREE";
title.style.color = type === "victory" ? "#32CD32" : "#E05252";
  message.textContent = type === "victory"
    ? "Victory! All 16 cards have been placed."
    : "Three strikes. Your reign has ended.";

  toastRemaining = 12;
  seconds.textContent = toastRemaining;
  toast.hidden = false;

  toastTimer = setInterval(() => {
    toastRemaining--;
    seconds.textContent = toastRemaining;

    if (toastRemaining <= 0) {
      clearInterval(toastTimer);
    }
  }, 1000);

  toastResetTimer = setTimeout(startNewGameFromToast, 12000);
}

function startNewGameFromToast() {
  clearInterval(toastTimer);
  clearTimeout(toastResetTimer);

  document.getElementById("game-toast").hidden = true;
  resetGame();
}

document.getElementById("toast-numbers").addEventListener("click", () => {
  const played = gameStats.played;
  const wins = gameStats.wins;
  const winRate = played ? Math.round(wins / played * 100) : 0;
  const average = played
    ? (gameStats.totalCardsPlaced / played).toFixed(1)
    : "0.0";

  document.getElementById("numbers-content").innerHTML =
    "<p>Games Played: " + played + "</p>" +
    "<p>Victories: " + wins + "</p>" +
    "<p>Win Percentage: " + winRate + "%</p>" +
    "<p>Current Streak: " + gameStats.currentStreak + "</p>" +
    "<p>Longest Streak: " + gameStats.bestStreak + "</p>" +
    "<p>Average Cards Placed: " + average + "</p>";
clearInterval(toastTimer);
  clearTimeout(toastResetTimer);
document.getElementById("numbers-panel").hidden = false;
});
document.getElementById("toast-share").addEventListener("click", async () => {
  const won = cardsPlaced === 16;
  const played = gameStats.played;
  const wins = gameStats.wins;
  const winRate = played ? Math.round(wins / played * 100) : 0;
  const date = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric"
  });

  const message = [
   "♛ HIERARCHY — A King's Decree", 
    date,
    "",
    won ? "VICTORY #" + wins : "DEFEAT",
    cardsPlaced + " / 16 Cards Placed",
    "Strikes: " + strikes + " / 3",
    "Royal Pardons: " + royalPardons,
    "",
    "Games Played: " + played,
    "Win Rate: " + winRate + "%",
    "",
    "https://hierarchy.games"
  ].join("\n");

  if (navigator.share) {
    try {
      await navigator.share({ text: message });
    } catch (error) {
      if (error.name !== "AbortError") console.error(error);
    }
  } else {
    try {
      await navigator.clipboard.writeText(message);
      alert("Share message copied!");
    } catch (error) {
      alert(message);
    }
  }
});
document.getElementById("numbers-close").addEventListener("click", () => {
  document.getElementById("numbers-panel").hidden = true;
  startNewGameFromToast();
});
// Detect an unavoidable third strike.
function checkAutomaticDefeat() {
  if (gameOver || !currentCard || strikes !== 2) return;

  const emptySlots = [...court.querySelectorAll(".court-slot")]
    .filter(slot => !slot.dataset.value);

  const hasLegalMove = emptySlots.some(slot =>
    isLegalPlacement(slot, currentCard)
  );

  if (!hasLegalMove) {
    strikes = 3;
const strikeDots = document.querySelectorAll(".strike-dot");
strikeDots[2].classList.add("used");
    gameOver = true;
    drawPile.style.pointerEvents = "none";
    discardButton.disabled = true;
    showGameEnding("defeat");
  }
}

const rulesButton = document.getElementById("rules-btn");

rulesButton.addEventListener("click", () => {
  let panel = document.getElementById("hierarchy-rules");

  if (!panel) {
    panel = document.createElement("div");
    panel.id = "hierarchy-rules";

    panel.innerHTML = `
      <div class="hierarchy-rules-box">
        <h2>HIERARCHY — RULES</h2>
        <p>1. Place all 16 cards to win.</p>
        <p>2. Ace is low. King is high.</p>
        <p>3. Cards must increase from left to right and from bottom to top.</p>
        <p>4. The three circles represent strikes. Each discarded card fills one circle. Three strikes end the game.</p>
        <p>5. ROYAL PARDON: Legally placing an Ace or King removes one accumulated strike.</p>
        <p>6. Multiple Royal Pardons may be earned in one game.</p>
        <button id="close-hierarchy-rules">CLOSE</button>
      </div>
    `;

    document.body.appendChild(panel);

    document.getElementById("close-hierarchy-rules")
      .addEventListener("click", () => {
        panel.style.display = "none";
      });
  }

  panel.style.display = "flex";
});
