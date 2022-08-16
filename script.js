const fields = document.querySelectorAll(".game__field");
const results = document.querySelector(".game__results");
const turn = document.querySelector(".game__turn");
let player = 1;
let player1fields = [];
let player2fields = [];
let winner = 0;
let winComb = [];
let freeFields = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let restore = true;

fetch("api.php?api-name=getCells", {
  method: "GET",
})
  .then(async (response) => await response.json())
  .then((data) => {
    for (let cell in data["cells"]) {
      fields[data["cells"][cell] - 1].click();
    }
    restore = false;
  });

const saveTurn = function (index) {
  const data = new FormData();
  data.set("addCell", index);
  fetch("api.php?api-name=add-cell", {
    method: "POST",
    body: data,
  });
};

const winCombs = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

const reset = async function (evt) {
  await fetch("api.php?api-name=reset", {
    method: "GET",
  }).then(async (response) => await response.json());
  location.reload();
};
const change = function () {
  if (player == 1) {
    player = 2;
  } else if (player == 2) {
    player = 1;
  }
  turn.textContent = player;
};

const fill = function () {
  if (player == 1) {
    return "X";
  } else if (player == 2) {
    return "O";
  } else return "";
};
const deleteOcc = function (index) {
  freeFields.splice(freeFields.indexOf(index), 1);
};

const botStep = function () {
  if (player == 2) {
    const randField = Math.floor(Math.random() * freeFields.length);
    fields[freeFields[randField]].click();
  }
};

const winCheck = function () {
  if (player == 1) {
    let counter = 0;
    for (let comb of winCombs) {
      counter = 0;
      for (let value of comb) {
        if (player1fields.includes(value)) {
          counter++;
        }
        if (counter == 3) {
          winComb = comb;
          winner = 1;
        }
      }
    }
  } else if (player == 2) {
    let counter = 0;
    for (let comb of winCombs) {
      counter = 0;
      for (let value of comb) {
        if (player2fields.includes(value)) {
          counter++;
        }
        if (counter == 3) {
          winComb = comb;
          winner = 2;
        }
      }
    }
  }
  if (winner > 0) {
    results.innerText = "Winner is player " + winner;
    player = 0;
    for (let value of winComb) {
      fields[value - 1].classList.add("comb");
    }
  }
};

fields.forEach((el, index) => {
  el.onclick = function (evt) {
    if (!this.firstChild.innerText) {
      if (player == 1) {
        player1fields.push(index + 1);
        if (!restore) {
          saveTurn(index + 1);
        }
      } else if (player == 2) {
        player2fields.push(index + 1);
        if (!restore) {
          saveTurn(index + 1);
        }
      }
      deleteOcc(index);
      this.firstChild.innerText = fill();
      winCheck();
      change();
      if (!restore && winner == 0) {
        botStep();
      }
    }
  };
});
