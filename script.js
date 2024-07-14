const numbers = [1, 2, 3];
const colors = ["red", "purple", "green"];
const shapes = ["squiggle", "diamond", "oval"];
const shadings = ["solid", "striped", "empty"];

class Deck {
  constructor() {
    this._numCards = 81;
    this.cards = [];
    this.createDeck();
  }

  createDeck() {
    for (let shading of shadings) {
      for (let shape of shapes) {
        for (let color of colors) {
          for (let number of numbers) {
            this.cards.push(new Card(color, shape, number, shading));
          }
        }
      }
    }
    this.shuffle();
  }

  drawCard() {
    return this.cards.pop();
  }

  shuffle() {
    this.cards = this.cards.sort(() => Math.random() - 0.5);
  }

  drawCards(n) {
    if (n <= this._numCards) {
      let list = [];
      for (let i = 0; i < n; i++) {
        list.push(this.cards.pop());
      }
      this._numCards -= n;
      return list;
    }
  }

  get numCards() {
    return this._numCards;
  }
}

class Card {
  constructor(color, shape, number, shading) {
    this.color = color;
    this.shape = shape;
    this.number = number;
    this.shading = shading;
    this.selected = false;
  }
  toString() {
    return `${this.color} ${this.shading} ${this.number} ${this.shape}`;
  }

  createIcon() {
    let container = document.createElement("div");
    container.classList.add("card-icons");
    for (let i = 0; i < this.number; i++) {
      let img = document.createElement("img");
      img.src = `svg/${this.shading}${this.shape}.svg`;
      if (this.color === "red") {
        img.classList.add("red");
      } else if (this.color === "purple") {
        img.classList.add("purple");
      } else if (this.color === "green") {
        img.classList.add("green");
      }
      container.appendChild(img);
    }
    return container;
  }
}

let board = [];
let selected = [];

function initBoard() {
  let deck = new Deck();
  for (let i = 0; i < 12; i++) {
    board.push(deck.drawCard());
  }

  board.forEach((card) => {
    let cardElem = document.createElement("button");
    cardElem.addEventListener("click", () => {
      cardElem.classList.toggle("selected");
      card.selected = !card.selected;
      if (card.selected) {
        selected.push(card);
      } else {
        selected = selected.filter((c) => c !== card);
      }
      console.log(selected.length);
      if (selected.length === 3) {
        submit.className = "black-button";
      } else {
        submit.className = "gray-button";
      }

      if (selected.length === 0) {
        deselect.className = "gray-button";
      } else {
        deselect.className = "white-button";
      }
    });

    cardElem.classList.add("card");

    cardElem.appendChild(card.createIcon());
    grid.appendChild(cardElem);
  });
}

function validSet(card1, card2, card3) {
  let setAttributes = ["color", "shape", "number", "shading"];
  for (let attribute of setAttributes) {
    //loops through each cards attributes and put them in one Set data structre
    //once the set is created, the size of 1 signifies all the same attributes
    //or size of 3 would signify the cards to have different attributes
    let sameOrDiff = new Set([
      card1[attribute],
      card2[attribute],
      card3[attribute],
    ]);
    //a set would be signaled by the length of either 1 or 3; so 2 would show no set
    if (sameOrDiff.size === 2) {
      return false;
    }
  }
  return true;
}

function handleSetClick(selected) {
  //the event handler when a player clicks a set and goes through the
  //process of verifying it as a set
  //verifies its a set and initiates the replacing process to start
  if (validSet(selected[0], selected[1], selected[2])) {
    showPopup("You found a set!");
    deselectAll();
  } else {
    showPopup("Not a set");
  }
}

function deselectAll() {
  selected.forEach((card) => {
    card.selected = false;
    selected = [];
    deselect.className = "gray-button";
    submit.className = "gray-button";
  });
  grid.childNodes.forEach((cardElem) => {
    cardElem.classList.remove("selected");
  });
}

function showPopup(message) {
  popup.innerHTML = message;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
}

const grid = document.querySelector(".grid");
const submit = document.querySelector("#submit");
const deselect = document.querySelector("#deselect");
const restart = document.querySelector("#restart");
const helpButton = document.querySelector(".help");
const helpMenu = document.querySelector("dialog");
const setExample = document.querySelector(".set-example");
const closeButton = document.querySelector(".close");
const popup = document.querySelector(".popup");

// Generate example graphics
example = [
  new Card("green", "squiggle", 1, "empty"),
  new Card("green", "squiggle", 2, "solid"),
  new Card("green", "squiggle", 3, "striped"),
  new Card("green", "oval", 1, "empty"),
  new Card("purple", "squiggle", 2, "solid"),
  new Card("red", "diamond", 3, "striped"),
];

example.forEach((card) => {
  let cardElem = document.createElement("button");
  cardElem.classList.add("card");
  cardElem.appendChild(card.createIcon());
  setExample.appendChild(cardElem);
});

//Event listeners for the help menu
closeButton.addEventListener("click", () => {
  helpMenu.close();
});

helpButton.addEventListener("click", () => {
  helpMenu.showModal();
});

restart.addEventListener("click", () => {
  grid.innerHTML = "";
  initBoard();
});

deselect.addEventListener("click", () => {
  deselectAll();
});

submit.addEventListener("click", () => {
  handleSetClick(selected);
});

initBoard();
