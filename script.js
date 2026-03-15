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

function startGame() {

    createDeck()
    shuffleDeck()
    dealCards()


    document.getElementById("playerCards").innerText = playerCards
    document.getElementById("dealerCards").innerText = dealCards
    console.log(playerCards)
    console.log(dealerCards)

}
