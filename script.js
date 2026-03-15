// Create a deck of 52 cards with suit symbols
const suits = ['♥', '♦', '♣', '♠'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let practiceMode = 'basic'; // 'basic', 'pairs', 'soft'
let deck = [];
let countCardsEnabled = true;
let gameMode = 'practice';
let hasActed = false;
let gameEnded = false;
let playerHands = [];
let currentHandIndex = 0;
let dealerCards = [];
// In practice mode, record each decision with recommended move, current hand, and dealer upcard.
let playerActions = [];

// Global counters to persist accuracy across games.
let globalTotalHands = 0;
let globalCorrectHands = 0;

// New global variable for auto replay (default off)
let autoReplayEnabled = false;

document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener('change', (event) => {
    gameMode = event.target.value;
    startGame();    // ← restart to show the new mode immediately
  });
});



// Listen for changes on the auto replay checkbox.
document.getElementById('auto-replay').onchange = function () {
  autoReplayEnabled = this.checked;
};

// Debug functions
document.getElementById('debug-deal').addEventListener('click', () => {
    document.getElementById('debug-dialog').showModal();
});

document
  .querySelectorAll('input[name="variant"]')
  .forEach(radio => {
    radio.addEventListener('change', e => {
      blackjackVariant = e.target.value;
      currentBasicStrategy =
        blackjackVariant === 'european'
          ? europeanBasicStrategy
          : americanBasicStrategy;

      // toggle the displayed table (you already have this further down)
      document.getElementById('european-strategy').style.display =
        blackjackVariant === 'european' ? 'block' : 'none';
      document.getElementById('american-strategy').style.display =
        blackjackVariant === 'american'  ? 'block' : 'none';

      startGame();  // ← restart so user immediately sees the new variant
    });
  });


function handleDebugDeal() {
    const dealerInput = document.getElementById('debug-dealer-cards').value.trim();
    const playerInput = document.getElementById('debug-player-cards').value.trim();

    const dealerCards = parseCardInput(dealerInput);
    const playerCards = parseCardInput(playerInput);

    // if the user input something invalid, bail out
    if (dealerCards === null || playerCards === null) return;

    // close the dialog and start with whatever they gave us
    document.getElementById('debug-dialog').close();
    startGame(dealerCards, [playerCards]);
}


function parseCardInput(input) {
    const validValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    if (!input) return null;
    
    const cardStrings = input.split(',').map(c => c.trim());
    const parsedCards = [];
    
    for (const cardStr of cardStrings) {
        let value;
        const trimmedStr = cardStr.trim().toUpperCase();
        
        // Extract value (ignore any suit characters)
        if (trimmedStr.startsWith('10')) {
            value = '10';
        } else {
            value = trimmedStr[0];
        }
        
        // Validate value
        if (!validValues.includes(value)) {
            alert(`Invalid value '${value}' in card '${cardStr}'. Valid values are 2-10, J, Q, K, A.`);
            return null;
        }
        
        // Assign random suit
        const suit = suits[Math.floor(Math.random() * suits.length)];
        parsedCards.push({ value, suit });
    }
    
    return parsedCards;
}

function isBlackjack(hand) {
    return hand.length === 2 && calculateScore(hand) === 21;
}

function updatePracticeMode(mode) {
  practiceMode = mode;
}
document.querySelectorAll('input[name="practice-mode"]').forEach(radio => {
  radio.addEventListener('change', e => {
    practiceMode = e.target.value;  // same as updatePracticeMode()
    startGame();                    // ← restart with the new practice submode
  });
});


const europeanBasicStrategy = {
  hard: {
    5: { move: 'hit' },
    6: { move: 'hit' },
    7: { move: 'hit' },
    8: { move: 'hit' },
    9: { 2: 'hit', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    10: { 2: 'double', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'double', 8: 'double', 9: 'double', 10: 'hit', A: 'hit' },
    11: { 2: 'double', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'double', 8: 'double', 9: 'double', 10: 'hit', A: 'hit' },
    12: { 2: 'hit', 3: 'hit', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    13: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    14: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    15: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    16: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    17: { move: 'stand' },
    18: { move: 'stand' },
    19: { move: 'stand' },
    20: { move: 'stand' },
    21: { move: 'stand' }
  },
  soft: {
    13: { 2: 'hit', 3: 'hit', 4: 'hit', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    14: { 2: 'hit', 3: 'hit', 4: 'hit', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    15: { 2: 'hit', 3: 'hit', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    16: { 2: 'hit', 3: 'hit', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    17: { 2: 'hit', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    18: { 2: 'double', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'stand', 8: 'stand', 9: 'hit', 10: 'hit', A: 'hit' },
    19: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'double', 7: 'stand', 8: 'stand', 9: 'stand', 10: 'stand', A: 'stand' },
    20: { move: 'stand' },
    21: { move: 'stand' }
  },
  pairs: {
    2: { 2: 'hit', 3: 'hit', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    3: { 2: 'hit', 3: 'hit', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    4: { 2: 'hit', 3: 'hit', 4: 'hit', 5: 'split', 6: 'split', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    5: { 2: 'double', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'double', 8: 'double', 9: 'double', 10: 'hit', A: 'hit' },
    6: { 2: 'hit', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    7: { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    8: { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'split', 9: 'split', 10: 'hit', A: 'hit' },
    9: { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'stand', 8: 'split', 9: 'split', 10: 'stand', A: 'stand' },
    10: { move: 'stand' }, // Always stand
    A: { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'split', 9: 'split', 10: 'split', A: 'hit' }
  }
};

const americanBasicStrategy = {
  hard: {
    5: { move: 'hit' },
    6: { move: 'hit' },
    7: { move: 'hit' },
    8: { move: 'hit' },
    9: { 2: 'hit', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    10: { 2: 'double', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'double', 8: 'double', 9: 'double', 10: 'hit', A: 'hit' },
    11: { 2: 'double', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'double', 8: 'double', 9: 'double', 10: 'double', A: 'double' },
    12: { 2: 'hit', 3: 'hit', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    13: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    14: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    15: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    16: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    17: { move: 'stand' },
    18: { move: 'stand' },
    19: { move: 'stand' },
    20: { move: 'stand' },
    21: { move: 'stand' }
  },
  soft: {
    13: { 2: 'hit', 3: 'hit', 4: 'hit', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    14: { 2: 'hit', 3: 'hit', 4: 'hit', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    15: { 2: 'hit', 3: 'hit', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    16: { 2: 'hit', 3: 'hit', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    17: { 2: 'hit', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    18: { 2: 'double', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'stand', 8: 'stand', 9: 'hit', 10: 'hit', A: 'hit' },
    19: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'double', 7: 'stand', 8: 'stand', 9: 'stand', 10: 'stand', A: 'stand' },
    20: { move: 'stand' },
    21: { move: 'stand' }
  },
  pairs: {
    2: { 2: 'hit', 3: 'hit', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    3: { 2: 'hit', 3: 'hit', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    4: { 2: 'hit', 3: 'hit', 4: 'hit', 5: 'split', 6: 'split', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    5: { 2: 'double', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'double', 8: 'double', 9: 'double', 10: 'hit', A: 'hit' },
    6: { 2: 'hit', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    7: { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
    8: { move: 'split' },
    9: { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'stand', 8: 'split', 9: 'split', 10: 'stand', A: 'stand' },
    "10": { move: 'stand' },
    "A": { move: 'split' }
  }
};

let blackjackVariant = 'european';                // current user choice
let currentBasicStrategy = europeanBasicStrategy; // what all your functions will use


// Helper: checks if a hand is soft (i.e. at least one Ace remains counted as 11).
function isSoftHand(cards) {
    let score = 0;
    let aceCount = 0;
    for (let card of cards) {
        if (card.value === 'A') {
            score += 11;
            aceCount++;
        } else if (['J', 'Q', 'K'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }
    return aceCount > 0;
}

/* 
   Returns the displayed score for a hand.
   If the hand is soft (i.e. an Ace is still counted as 11), the score is prefixed with "S"
   (e.g. A4 becomes "S15").
*/
function getScoreDisplay(cards) {
    const score = calculateScore(cards);
    return isSoftHand(cards) ? "S" + score : score;
}

// Full set of dealer upcards in order.
const fullDealerSet = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"];

/*
   Formats an array of dealer upcard values into a concise string.
   If the sorted array is contiguous and has more than one value, it outputs "first to last"
   (e.g. [2,3,4,5,6] becomes "2 to 6").
   Otherwise, it joins the values with commas.
*/
function formatCondition(arr) {
    if (arr.length === 0) return "";
    const order = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "A": 11 };
    let sorted = arr.slice().sort((a, b) => order[a] - order[b]);
    let contiguous = true;
    for (let i = 1; i < sorted.length; i++) {
        if (order[sorted[i]] !== order[sorted[i - 1]] + 1) {
            contiguous = false;
            break;
        }
    }
    if (contiguous && sorted.length > 1) {
        return sorted[0] + " to " + sorted[sorted.length - 1];
    }
    return sorted.join(", ");
}

function getConditionArray(playerHand, move) {
    let table = null;
    if (playerHand.length === 2 && playerHand[0].value === playerHand[1].value) {
        let pairVal = playerHand[0].value === 'A' ? 'A' : calculateScore([playerHand[0]]);
        table = currentBasicStrategy.pairs[pairVal];
    } else if (isSoftHand(playerHand)) {
        let score = calculateScore(playerHand);
        table = currentBasicStrategy.soft[score];
    } else {
        let score = calculateScore(playerHand);
        table = currentBasicStrategy.hard[score];
    }
    if (!table) return [];
    if (table.move) {
      return table.move === move ? fullDealerSet.slice() : [];
    }
  
    let arr = [];
    for (let key in table) {
      if (table[key] === move) {
        arr.push(key);
      }
    }
    return arr;
}

/*
   Returns tailored advice based on basic strategy.
*/
function getAdvice(recommended, actual, playerHand, dealerUpcard) {
	if (recommended === 'double' && playerHand.length > 2) {
        return "";
    }
    if (playerHand.length === 2 && playerHand[0].value === playerHand[1].value) {
        let pairValue = playerHand[0].value;
        if (recommended !== actual) {
            let allowed = getConditionArray(playerHand, actual);
            let conditionStr = formatCondition(allowed);
            if (allowed.length === 0)
              return `Noob, never ${actual.toUpperCase()} on pair of ${pairValue}s! You should ${recommended.toUpperCase()}.`;
            else
              return `Noob, for pair of ${pairValue}s, ${actual.toUpperCase()} only against ${conditionStr}! You should ${recommended.toUpperCase()}.`;
        }
        return "";
    } else {
        let table;
        if (isSoftHand(playerHand)) {
            table = currentBasicStrategy.soft[calculateScore(playerHand)];
        } else {
            table = currentBasicStrategy.hard[calculateScore(playerHand)];
        }
        if (table && table.move) {
            return `Noob, never ${actual.toUpperCase()} on ${getScoreDisplay(playerHand)}! You should ${recommended.toUpperCase()}.`;
        }
        let allowed = getConditionArray(playerHand, actual);
        if (allowed.length === 0) {
            return `Noob, never ${actual.toUpperCase()} on ${getScoreDisplay(playerHand)}! You should ${recommended.toUpperCase()}.`;
        }
        let disallowed = fullDealerSet.filter(card => !allowed.includes(card));
        let conditionArray, prefix;
        if (allowed.length <= disallowed.length) {
            conditionArray = allowed;
            prefix = "only";
        } else {
            conditionArray = disallowed;
            prefix = "never";
        }
        let conditionStr = formatCondition(conditionArray);
        let conditionPart = " against " + conditionStr;
        return `Noob, ${prefix} ${actual.toUpperCase()} on ${getScoreDisplay(playerHand)}${conditionPart}! You should ${recommended.toUpperCase()}.`;
    }
}

// Create a new deck and shuffle it.
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    shuffleDeck();
}

// Shuffle the deck using the Fisher-Yates algorithm.
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Draw a card from the deck.
function drawCard() {
    return deck.pop();
}

// Update the accuracy counter element on screen.
function updateAccuracyCounterDisplay(message) {
    document.getElementById('accuracy-counter').innerText = message;
}

// Start a new game.
function startGame(debugDealerCards, debugPlayerHands) {
	// ensure we’re using the latest user choice
currentBasicStrategy = blackjackVariant === 'european' ? europeanBasicStrategy : americanBasicStrategy;

    document.getElementById('controls').style.display = 'grid';
	if (gameMode === 'game') {
      document.getElementById('accuracy-counter').style.display = 'none';
    } else {
      document.getElementById('accuracy-counter').style.display = 'block';
    }

    if (debugDealerCards && debugPlayerHands) {
    dealerCards = debugDealerCards;
    playerHands = debugPlayerHands;
    createDeck();
    
    const removeCards = (cards) => {
        cards.forEach(card => {
            const index = deck.findIndex(c => c.value === card.value && c.suit === card.suit);
            if (index !== -1) deck.splice(index, 1);
        });
    };

    removeCards(dealerCards);
    playerHands.forEach(hand => removeCards(hand));

    // ── DEBUG TOP‑UP: ensure dealer has 2 cards
    while (dealerCards.length < 2) {
        dealerCards.push(drawCard());
    }

    // ── DEBUG TOP‑UP: ensure each player‑hand has at least 2 cards
    playerHands.forEach(hand => {
        while (hand.length < 2) {
            hand.push(drawCard());
        }
    });
} else {
    createDeck();
    
    // In practice mode, make sure no blackjacks are dealt
    if (gameMode === 'practice') {
        let tryAgain = true;
        while (tryAgain) {
            // Reset deck if we need to try again
            if (tryAgain) createDeck();
            
            // Deal dealer cards
            dealerCards = [drawCard(), drawCard()];
            
            // Deal player cards based on practice mode
            switch (practiceMode) {
                case 'pairs':
                    const pairValue = values[Math.floor(Math.random() * 13)];
                    const pairCards = deck.filter(c => c.value === pairValue).slice(0, 2);
                    deck = deck.filter(c => !pairCards.includes(c));
                    playerHands = [pairCards];
                    break;
                case 'soft': {
                    const ace = deck.find(c => c.value === 'A');
                    deck = deck.filter(c => c !== ace);
                    const validSeconds = deck.filter(c => ['2','3','4','5','6','7','8','9'].includes(c.value));
                    const secondCard = validSeconds[Math.floor(Math.random() * validSeconds.length)];
                    deck = deck.filter(c => c !== secondCard);
                    playerHands = [[ace, secondCard]];
                    break;
                }
                default: // basic
                    playerHands = [[drawCard(), drawCard()]];
            }
            
            // Check if we need to try again (if either has blackjack)
            tryAgain = isBlackjack(dealerCards) || isBlackjack(playerHands[0]);
        }
    } else {
        // Normal game mode - blackjacks are allowed
        dealerCards = [drawCard(), drawCard()];
        playerHands = [[drawCard(), drawCard()]];
    }
}

    hasActed = false;
    gameEnded = false;
    // Reset playerActions for the current game only
    playerActions = [];
    currentHandIndex = 0;

    displayCards(dealerCards, 'dealer');
    displayPlayerHands();
    displayFeedback("Your turn. Make a choice.");
    displayScores();

    document.getElementById('play-again').style.display = 'none';

    if (gameMode !== 'practice' && calculateScore(playerHands[0]) === 21) {
    displayFeedback("Blackjack! Automatically standing.");
    endGame();
    return;
}

    // Hit button
    document.getElementById('hit-button').onclick = function () {
  // 1) Practice tracking
  if (gameMode === 'practice') {
    const dealerUp = dealerCards[0].value === 'A'
      ? 'A'
      : calculateScore([dealerCards[0]]);
    const rec = getRecommendedMove(
      playerHands[currentHandIndex],
      dealerUp
    );
    playerActions.push({
      recommended: rec,
      actual: 'hit',
      playerHand: [...playerHands[currentHandIndex]],
      dealerUpcard: dealerUp,
      hand: currentHandIndex
    });
  }

  // 2) Block if already at 21 or more
  const currentScore = calculateScore(playerHands[currentHandIndex]);
  if (currentScore >= 21) {
    displayFeedback("You have reached 21 or more. You cannot hit further.");
    return;
  }

  // 3) Deal one card and show it
  playerHands[currentHandIndex].push(drawCard());
  hasActed = true;
  displayPlayerHands();

  // 4) Handle bust or auto-stand at 21 (scrolls & shows combined feedback)
  if (checkGameStatus()) {
    displayScores();
    return; 
  }

  // 5) Otherwise just update the score display
  displayScores();
};


    // Stand button
    document.getElementById('stand-button').onclick = function () {
        if (gameMode === 'practice') {
            const dealerUp = dealerCards[0].value === 'A' ? 'A' : calculateScore([dealerCards[0]]);
            const rec = getRecommendedMove(playerHands[currentHandIndex], dealerUp);
            playerActions.push({ recommended: rec, actual: 'stand', playerHand: [...playerHands[currentHandIndex]], dealerUpcard: dealerUp, hand: currentHandIndex });
        }
        currentHandIndex++;
        if (currentHandIndex < playerHands.length) {
			hasActed = false;
            displayFeedback(`Playing hand ${currentHandIndex + 1}.`);
			refreshAndScroll();
        } else {
            endGame();
        }
        displayScores();
    };

    // Double button
    document.getElementById('double-button').onclick = function () {
  const hand = playerHands[currentHandIndex];

  // 2) Only allow on exactly two cards
  if (hand.length !== 2) {
    displayFeedback("You can only double on your first two cards.");
    return;
  }

  // 3) Record practice-mode actions
  if (gameMode === 'practice') {
    const dealerUp =
      dealerCards[0].value === 'A'
        ? 'A'
        : calculateScore([dealerCards[0]]);
    const rec = getRecommendedMove(hand, dealerUp);
    playerActions.push({
      recommended: rec,
      actual: 'double',
      playerHand: [...hand],
      dealerUpcard: dealerUp,
      hand: currentHandIndex,
    });
  }

  // 4) Perform the double if not already acted
  if (!hasActed) {
    hand.push(drawCard());
    hasActed = true;
    displayPlayerHands();

    // If you hit 21, auto-stand message
    if (calculateScore(hand) === 21) {
      displayFeedback("You reached 21! Automatically standing.");
    }

    // Move to next hand or end
    currentHandIndex++;
    if (currentHandIndex < playerHands.length) {
      // **Reset** for the new hand so you can double again
      hasActed = false;
      displayFeedback(`Playing hand ${currentHandIndex + 1}.`);
	  refreshAndScroll();  
    } else {
      endGame();
    }
  }

  displayScores();
};

    // Split button
    document.getElementById('split-button').onclick = function () {
        if (gameMode === 'practice') {
            const dealerUp = dealerCards[0].value === 'A' ? 'A' : calculateScore([dealerCards[0]]);
            const rec = getRecommendedMove(playerHands[currentHandIndex], dealerUp);
            playerActions.push({ recommended: rec, actual: 'split', playerHand: [...playerHands[currentHandIndex]], dealerUpcard: dealerUp, hand: currentHandIndex });
        }
        const currentHand = playerHands[currentHandIndex];
        if (currentHand.length === 2 && currentHand[0].value === currentHand[1].value) {
            const newHand1 = [currentHand[0], drawCard()];
            const newHand2 = [currentHand[1], drawCard()];
            playerHands.splice(currentHandIndex, 1, newHand1, newHand2);
			hasActed = false;
            displayPlayerHands();
			refreshAndScroll();    
            displayFeedback(`Hand split. Playing hand ${currentHandIndex + 1}.`);
        } else {
            displayFeedback("You can only split with two identical cards.");
        }
        displayScores();
    };

    document.getElementById('count-cards').onchange = function () {
        countCardsEnabled = this.checked;
        displayScores();
        displayPlayerHands();
    };
    document.getElementById('count-cards').checked = true;
}

// COLLAPSIBLE MENU TOGGLE
const menuContainer = document.getElementById('menu-container');
const menuToggle    = document.getElementById('menu-toggle');


menuToggle.addEventListener('click', () => {
  menuContainer.classList.toggle('expanded');
  menuContainer.classList.toggle('collapsed');
});

// Displays each player hand with card images and the formatted score.
function displayPlayerHands() {
    const playerHandsDiv = document.getElementById('player-hands');
    playerHandsDiv.style.display = 'flex';
    playerHandsDiv.style.flexDirection = 'row';
    playerHandsDiv.style.justifyContent = 'center';
    playerHandsDiv.style.alignItems = 'flex-start';
    playerHandsDiv.style.gap = '10px';
    playerHandsDiv.innerHTML = '';

    playerHands.forEach((hand, index) => {
        const handDiv = document.createElement('div');
        handDiv.classList.add('player-hand');
        handDiv.style.minWidth = '150px';

        if (playerHands.length > 1) {
    const labelDiv = document.createElement('div');
    labelDiv.classList.add('player-hand-label');
    labelDiv.innerText = `Hand ${index + 1}`;
    handDiv.appendChild(labelDiv);
}

        const cardsDiv = document.createElement('div');
        cardsDiv.classList.add('player-hand-cards');
        cardsDiv.style.display = 'flex';
        cardsDiv.style.flexWrap = 'wrap';
        cardsDiv.style.gap = '5px';
        
        hand.forEach(card => {
            const cardElement = createCardElement(card);
            cardsDiv.appendChild(cardElement);
        });

        handDiv.appendChild(cardsDiv);

        const scoreDiv = document.createElement('div');
        scoreDiv.classList.add('player-hand-score');
        if (countCardsEnabled) {
            scoreDiv.innerText = `Score: ${getScoreDisplay(hand)}`;
        }
        handDiv.appendChild(scoreDiv);

        playerHandsDiv.appendChild(handDiv);
    });
	refreshAndScroll(); 
    
}

// Displays the dealer's cards.
function displayCards(cards, player) {
    const handDiv = document.getElementById(`${player}-cards`);
    handDiv.innerHTML = '';

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardElement = createCardElement(card, player === 'dealer' && i === 1 && !gameEnded);
        handDiv.appendChild(cardElement);
    }
}

// Creates a card element for display with suit and value.
function createCardElement(card, isHidden = false) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
	const suitNames = { "♥":"Hearts", "♦":"Diamonds", "♣":"Clubs", "♠":"Spades" };
cardElement.setAttribute(
  'aria-label',
  `${card.value} of ${suitNames[card.suit]}`
);

    const valueDiv = document.createElement('div');
    valueDiv.classList.add('card-value');
    
    const suitDiv = document.createElement('div');
    suitDiv.classList.add('card-suit');

    if (isHidden) {
        valueDiv.textContent = '🂠';
        suitDiv.textContent = '';
    } else {
        valueDiv.textContent = card.value;
        suitDiv.textContent = card.suit;
        suitDiv.classList.add(
            card.suit === '♥' ? 'heart' :
            card.suit === '♦' ? 'diamond' :
            card.suit === '♣' ? 'club' : 'spade'
        );
    }

    cardElement.appendChild(valueDiv);
    cardElement.appendChild(suitDiv);
    return cardElement;
}

// Displays a feedback message.
function displayFeedback(message, showPlayAgain = false) {
    document.getElementById('feedback').innerText = message;
    if (showPlayAgain) {
        document.getElementById('play-again').style.display = 'block';
    }
}

// Displays scores for dealer and player hands.
function displayScores() {
    if (countCardsEnabled) {
        const dealerScore = gameEnded ? getScoreDisplay(dealerCards) : calculateScore([dealerCards[0]]);
        document.getElementById('dealer-score').innerText = `Score: ${dealerScore}`;

        playerHands.forEach((hand, index) => {
            const scoreDiv = document.querySelector(`#player-hands .player-hand:nth-child(${index + 1}) .player-hand-score`);
            if (scoreDiv) {
                scoreDiv.innerText = `Score: ${getScoreDisplay(hand)}`;
            }
        });
    } else {
        document.getElementById('dealer-score').innerText = '';
        document.querySelectorAll('.player-hand-score').forEach(div => {
            div.innerText = '';
        });
    }
}

// Calculates the numerical score for a set of cards.
function calculateScore(cards) {
    let score = 0;
    let aceCount = 0;
    for (let card of cards) {
        if (['J', 'Q', 'K'].includes(card.value)) {
            score += 10;
        } else if (card.value === 'A') {
            score += 11;
            aceCount++;
        } else {
            score += parseInt(card.value);
        }
    }
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }
    return score;
}

// Checks if the current hand has busted; if so, moves to the next hand or ends the game.
function checkGameStatus() {
  const score = calculateScore(playerHands[currentHandIndex]);

  // BUST: over 21
  if (score > 21) {
    // Combined feedback line
    const nextHand = currentHandIndex + 1;
    if (nextHand < playerHands.length) {
      displayFeedback(`Hand ${currentHandIndex + 1} busts! Playing hand ${nextHand + 1}.`);
      currentHandIndex = nextHand;
      refreshAndScroll();   // auto-scroll to the new hand
    } else {
      displayFeedback(`Hand ${currentHandIndex + 1} busts!`);
      endGame();
    }
    return true; // indicate we handled it
  }

  // AUTO-STAND at 21
  if (score === 21 && !hasActed) {
    // Trigger a stand for them
    hasActed = true;
    const nextHand = currentHandIndex + 1;

    if (nextHand < playerHands.length) {
      displayFeedback(`Hand ${currentHandIndex + 1} hit 21! Playing hand ${nextHand + 1}.`);
      currentHandIndex = nextHand;
      refreshAndScroll();   // auto-scroll
    } else {
      displayFeedback(`Hand ${currentHandIndex + 1} hit 21!`);
      endGame();
    }
    return true;
  }

  return false; // no bust/21 auto-advance
}


// Ends the game by completing the dealer's hand and comparing scores.
function endGame() {
  document.getElementById('controls').style.display = 'none'; // Hide action buttons
  document.getElementById('play-again').style.display = 'block';
  gameEnded = true;

  // Dealer draws cards until they reach 17 or higher
  while (calculateScore(dealerCards) < 17) {
    dealerCards.push(drawCard());
  }

  // Display dealer's cards and scores
  displayCards(dealerCards, 'dealer');
  displayScores();

  if (gameMode === 'game') {
    // In Normal Game mode, hide the counter.
    document.getElementById('accuracy-counter').style.display = 'none';

    const finalDealerScore = calculateScore(dealerCards);
    let totalWins = 0;

    playerHands.forEach(hand => {
      const handScore = calculateScore(hand);
      if (handScore > 21) return;
      if (finalDealerScore > 21 || handScore > finalDealerScore) totalWins++;
      else if (handScore === finalDealerScore) totalWins += 0.5;
    });

    if (finalDealerScore > 21) {
      displayFeedback("Dealer busts! You win.", true);
    } else if (totalWins > 0) {
      displayFeedback(`You win ${totalWins} hand(s)!`, true);
    } else {
      displayFeedback("You lose.", true);
    }
    showPlayAgainButton();
  } 
  // Practice Mode
  else {
    // Group actions by hand index for the current game.
    const handGroups = {};
    playerActions.forEach(action => {
       if (handGroups[action.hand] === undefined) {
         handGroups[action.hand] = [];
       }
       handGroups[action.hand].push(action);
    });
    const currentTotalHands = Object.keys(handGroups).length;
    let currentCorrectHands = 0;
    for (let id in handGroups) {
       if (handGroups[id].every(action => action.recommended === action.actual)) {
          currentCorrectHands++;
       }
    }

    // Update global counters
    globalTotalHands += currentTotalHands;
    globalCorrectHands += currentCorrectHands;

    const globalPercentage = globalTotalHands > 0 ? Math.round((globalCorrectHands / globalTotalHands) * 100) : 0;
    updateAccuracyCounterDisplay(`Basic Strategy Accuracy: ${globalCorrectHands}/${globalTotalHands} (${globalPercentage}%)`);

    let adviceMessages = [];
    playerActions.forEach(action => {
      if (action.recommended !== action.actual) {
        const advice = getAdvice(action.recommended, action.actual, action.playerHand, action.dealerUpcard);
        if (advice) adviceMessages.push(advice);
      }
    });
    let finalMessage = "";
    if (adviceMessages.length === 0) {
      finalMessage = "Great job! You followed basic strategy consistently!";
    } else {
      finalMessage = adviceMessages.join("\n");
    }
    // In practice mode, display feedback without automatically showing the Play Again button.
    displayFeedback(finalMessage, false);

    // If the player is correct and auto replay is enabled, auto restart.
    if (adviceMessages.length === 0 && autoReplayEnabled) {
       // hide Play Again and auto-restart
       document.getElementById('play-again').style.display = 'none';
       setTimeout(() => startGame(), 1500);
    } else {
       // show Play Again when either incorrect or auto-replay is off
       document.getElementById('play-again').style.display = 'block';
    }
  }
}

// Shows the Play Again button.
function showPlayAgainButton() {
    document.getElementById('play-again').style.display = 'block';
}

// Returns the recommended move based on basic strategy.
function getRecommendedMove(playerHand, dealerUpcard) {
    const playerScore = calculateScore(playerHand);
    const isPair = (playerHand.length === 2 && playerHand[0].value === playerHand[1].value);
    let move = 'hit';
    if (isPair) {
        let pairVal = playerHand[0].value === 'A' ? 'A' : calculateScore([playerHand[0]]);
        if (currentBasicStrategy.pairs[pairVal] && currentBasicStrategy.pairs[pairVal].move) {
            move = currentBasicStrategy.pairs[pairVal].move;
        } else if (currentBasicStrategy.pairs[pairVal]) {
            move = currentBasicStrategy.pairs[pairVal][dealerUpcard] || 'hit';
        }
    } else if (isSoftHand(playerHand)) {
        if (currentBasicStrategy.soft[playerScore] && currentBasicStrategy.soft[playerScore].move) {
            move = currentBasicStrategy.soft[playerScore].move;
        } else if (currentBasicStrategy.soft[playerScore]) {
            move = currentBasicStrategy.soft[playerScore][dealerUpcard] || 'hit';
        }
    } else {
        if (currentBasicStrategy.hard[playerScore] && currentBasicStrategy.hard[playerScore].move) {
            move = currentBasicStrategy.hard[playerScore].move;
        } else if (currentBasicStrategy.hard[playerScore]) {
            move = currentBasicStrategy.hard[playerScore][dealerUpcard] || 'hit';
        }
    }
    return move;
}

document.getElementById('play-again').addEventListener('click', function () {
    startGame();
});

startGame();


window.addEventListener('DOMContentLoaded', () => {
    const requiredButtons = ['hit-button', 'stand-button', 'double-button', 'split-button', 'play-again'];
    requiredButtons.forEach(buttonId => {
        if (!document.getElementById(buttonId)) {
            console.error(`Missing required button: #${buttonId}`);
            alert(`Critical error: Missing button ${buttonId}. Please check your HTML!`);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
  // Strategy Table Code
  document.getElementById('show-strategy').addEventListener('click', function() {
    document.getElementById('strategy-overlay').classList.add('visible');
    document.getElementById('menu-container').classList.remove('expanded');
  });

  document.getElementById('close-strategy').addEventListener('click', function() {
    document.getElementById('strategy-overlay').classList.remove('visible');
  });

  // Close when clicking outside
  document.getElementById('strategy-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('visible');
    }
  });
});

document.querySelectorAll('input[name="variant"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const europeanTable = document.getElementById('european-strategy');
    const americanTable = document.getElementById('american-strategy');
    
    if (e.target.value === 'american') {
      europeanTable.style.display = 'none';
      americanTable.style.display = 'block';
    } else {
      europeanTable.style.display = 'block';
      americanTable.style.display = 'none';
    }
  });
});

// ▶️ Restart game when the practice‐mode dropdown changes
document.getElementById('practice-mode').addEventListener('change', function(e) {
  practiceMode = e.target.value;  // update your global
  startGame();                    // immediately relaunch with the new submode
});

function alignPlayerHands() {
  const wrap = document.getElementById('player-hands');
  if (!wrap) return;

  // If content wider than the box (needs scrolling) → flush left
  if (wrap.scrollWidth > wrap.clientWidth + 1) {
    wrap.style.justifyContent = 'flex-start';
  } else {
    wrap.style.justifyContent = 'center';
  }
}

/* Smoothly scroll #player-hands so the given hand is in view */
function scrollToHand(index) {
  const wrap = document.getElementById('player-hands');
  const hand = wrap.querySelector(`.player-hand:nth-child(${index + 1})`);
  if (hand) {
    hand.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

/* Call this after you redraw or move to a new hand */
function refreshAndScroll() {
  alignPlayerHands();                 // keep the layout tidy
  scrollToHand(currentHandIndex);     // show the active hand
}

