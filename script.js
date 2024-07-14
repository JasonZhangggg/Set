const numbers = [1, 2, 3];
const colors = ["red", "purple", "green"];
const shapes = ["squiggle", "diamond", "oval"];
const shadings = ["solid", "striped", "empty"];

const grid = document.querySelector(".grid");
const submit = document.querySelector("#submit");
const deselect = document.querySelector("#deselect");
const restart = document.querySelector("#restart");
const helpButton = document.querySelector(".help");
const helpMenu = document.querySelector(".help-menu");
const solutionMenu = document.querySelector(".solution-menu");
const solutionButton = document.querySelector(".solution");
const exampleGrid = document.querySelector("#example-grid");
const solutionGrid = document.querySelector("#solution-grid");
const closeHelp = document.querySelector("#close-help");
const closeSolution = document.querySelector("#close-sol");
const popup = document.querySelector(".popup");
const remaining = document.querySelector("#remaining");

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
let everyPosSet = [];

function initBoard() {
  do {
    board = [];
    selected = [];
    let deck = new Deck();
    for (let i = 0; i < 12; i++) {
      board.push(deck.drawCard());
    }
    everyPosSet = everySetOnBoard(board);
  } while (everyPosSet.length === 0);
  updateRemaining();

  board.forEach((card) => {
    let cardElem = document.createElement("button");
    cardElem.addEventListener("click", () => {
      if (card.selected || selected.length < 3) {
        card.selected = !card.selected;
        cardElem.classList.toggle("selected");
        selected = card.selected
          ? selected.concat(card)
          : selected.filter((c) => c !== card);
      }

      selected.length === 3
        ? (submit.className = "black-button")
        : (submit.className = "gray-button");

      selected.length === 0
        ? (deselect.className = "gray-button")
        : (deselect.className = "white-button");
    });

    cardElem.classList.add("card");

    cardElem.appendChild(card.createIcon());
    grid.appendChild(cardElem);
  });
}

function updateRemaining() {
  remaining.innerHTML = "";
  for (let i = 0; i < everyPosSet.length; i++) {
    let span = document.createElement("span");
    span.classList.add("circle");
    remaining.appendChild(span);
  }
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

function everySetOnBoard(board) {
  let everyPosSet = [];
  //triple nested loop to see all possible cards and if they work as sets
  for (let a = 0; a < board.length - 2; a++) {
    for (let b = a + 1; b < board.length - 1; b++) {
      for (let c = b + 1; c < board.length; c++) {
        //check if valid set, and if it is then we add to our big hashset
        let currentSet = [board[a], board[b], board[c]];
        if (validSet(board[a], board[b], board[c])) {
          everyPosSet.push(currentSet);
        }
      }
    }
  }
  return everyPosSet;
}

function handleSetClick(selected) {
  //the event handler when a player clicks a set and goes through the
  //process of verifying it as a set
  //verifies its a set and initiates the replacing process to start
  if (everyPosSet.some((set) => set.every((card) => selected.includes(card)))) {
    showPopup("You found a set!");
    everyPosSet = everyPosSet.filter(
      (set) => !set.every((card) => selected.includes(card))
    );
    updateRemaining();
    deselectAll();
  } else {
    if (validSet(selected[0], selected[1], selected[2])) {
      showPopup("Already found");
    } else {
      showPopup("Not a set");
    }
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
  exampleGrid.appendChild(cardElem);
});

solutionButton.addEventListener("click", () => {
  solutionMenu.showModal();
  solutionGrid.innerHTML = "";
  everyPosSet.forEach((set) => {
    set.forEach((card) => {
      let cardElem = document.createElement("button");
      cardElem.classList.add("card");
      cardElem.appendChild(card.createIcon());
      solutionGrid.appendChild(cardElem);
    });
  });
});

closeSolution.addEventListener("click", () => {
  solutionMenu.close();
});

//Event listeners for the help menu
closeHelp.addEventListener("click", () => {
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
