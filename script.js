function hit() {
    playerCards.push(deck.pop())
}
function stand() {
    alert("JavaScript działa!")
}
function double() {
    alert("JavaScript działa!")
}
function split() {
    alert("JavaScript działa!")
}

let deck = []
let playerCards = []
let dealerCards = []

function createDeck() {

    let suits = ["♠", "♥", "♦", "♣"]
    let values = [
        "A","2","3","4","5","6","7","8","9","10","J","Q","K"
    ]

    deck = []

    for (let suit of suits) {
        for (let value of values) {

            deck.push({
                suit: suit,
                value: value
            })

        }
    }
}

function shuffleDeck() {
    deck.sort(() => Math.random() - 0.5)
}

function dealCards() {

    playerCards = []
    dealerCards = []

    playerCards.push(deck.pop())
    dealerCards.push(deck.pop())

    playerCards.push(deck.pop())
    dealerCards.push(deck.pop())
}

startGame() {
    createDeck()
    shuffleDeck()
    dealCards()
    updateCards()
}

function updateCards() {

    // Gracz
    const playerDiv = document.getElementById("playerCards")
    playerDiv.innerHTML = ""  // czyścimy div

    playerCards.forEach(card => {
        let cardDiv = document.createElement("div")
        cardDiv.innerText = card.value + card.suit
        cardDiv.className = "bg-white text-black p-2 rounded shadow"
        playerDiv.appendChild(cardDiv)
    })

    // Dealer
    const dealerDiv = document.getElementById("dealerCards")
    dealerDiv.innerHTML = ""

    dealerCards.forEach(card => {
        let cardDiv = document.createElement("div")
        cardDiv.innerText = card.value + card.suit
        cardDiv.className = "bg-white text-black p-2 rounded shadow"
        dealerDiv.appendChild(cardDiv)
    })
}
