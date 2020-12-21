
// 128 клеток
// 0 - пусто 1 - корабль 2 - уничтожен

////////////////////////////////////////////////////////////////
// initialization

let player = {
  board: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  boardHTML: null,
  force: [],
  
}

let mainPlayer = {
  boardHTML: document.querySelector('.board__main'),
  __proto__: player,
};

let enemyPlayer = {
  boardHTML: document.querySelector('.board__enemy'),
  __proto__: player,
};

function Ship(size = 2) {
  this.size = size;
  this.position = [];
  this.isAlive = true;
  this.setPosition = function (position) {
    for (const iterator of position) {
      this.position.push({position: iterator, isBroken: false});
    }
  }
  this.hitted = function (position) {
    
  }
}

let shiftDirection = {
  top: function (position) {
    return position - 16;
  },
  bottom: function (position) {
    return position + 16;
  },
  left: function (position) {
    return position - 1;
  },
  right: function (position) {
    return position + 1;
  },
}

// end
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// Initialization parametrs

function initializationGameData () {
  mainPlayer.force.push(new Ship(size = 3, position = [7,8,9]));
}

// end
////////////////////////////////////////////////////////////////

//////////////////////////////////////////////
// Создание кораблей

/**
 * Create ships on random positions
 * @param {object} player Main or Enemy
 */
function generateRandomShips(player) {
  for (const ship of player.force) {
    generateCurrentShip(ship, player.board);
  }
}

function generateCurrentShip (ship, board) {

  let done = false;
  
  while (!done) {
    let start = getRandomPosition(board);
    let shipDirection = Math.round(Math.random() * 3);
    console.log(done);

    let shift = start;

    let again = false;

    for (let i = 0; i <= ship.size; i++) {
      if (
        !checkPosition(shift, board) ||
        shift % 16 == 15 ||
        shift % 16 == 0 ||
        shift < 16 ||
        shift > 112
      ) {
        again = true;
        break;
      }
    shift = shiftToNumberDirection(shift, shipDirection);
    }
    if (again) {continue};

    let curPos = start;
    board[curPos] = 1;

    for(let i = 1; i < ship.size; i++) {
      curPos = shiftToNumberDirection(curPos, shipDirection);
      board[curPos] = 1;
      ship.position.push(curPos);
    }
    done = true;
  }
}

function getRandomPosition (board) {
  let start = 0;
  do {
    start = Math.round(Math.random() * 128);
  } while (board[start] == 1);

  if(start % 16 == 15) {
    start = shiftDirection.left(start);
  }
  if(start % 16 == 0) {
    start = shiftDirection.right(start);
  }
  if(start < 16) {
    start = shiftDirection.bottom(start);
  }
  if(start > 112) {
    start = shiftDirection.top(start);
  }

  return start;
}

function checkPosition (position, board) {
  if(board[shiftDirection.top(position)] 
  || board[shiftDirection.top(position - 1)] 
  || board[shiftDirection.top(position + 1)]
  || board[shiftDirection.bottom(position)]
  || board[shiftDirection.bottom(position - 1)]
  || board[shiftDirection.bottom(position + 1)]
  || board[shiftDirection.left(position)]
  || board[shiftDirection.right(position)]
  ) {
    return false;
  } else {
    return true;
  }
}

function shiftToNumberDirection(shift, direction) {
  switch (direction) {
    case 0:
      return shiftDirection.top(shift);
      break;
    case 1:
      return shiftDirection.bottom(shift);
      break;
    case 2:
      return shiftDirection.left(shift);
      break;
    case 3:
      return shiftDirection.right(shift);
      break;
    default:
      break;
  }
}

// end
////////////////////////////////////////////////


////////////////////////////////////////////////
// Manipulation with board


function clearBoard(board) {
  board.fill(0);
}

function renderBoard(player) {
  player.board.map((element, index)=>{
    if(element == 0) {
      player.boardHTML.children[index].classList.remove('ship', 'dead');
      player.boardHTML.children[index].classList.add('main__cell');
    } else if(element == 1) {
      player.boardHTML.children[index].classList.add('ship');
    } else if(element == 2) {
      player.boardHTML.children[index].classList.add('dead');
    }
  })
}

// end
////////////////////////////////

///////////////////////////////////
// main turn

enemyPlayer.boardHTML.addEventListener('click', (e) => {
  if(e.target === enemyPlayer.boardHTML) return;
  if(e.target.classList.contains('miss')) return;
  if(e.target.classList.contains('dead')) return;


  let eIndex = 0;
  for (index of enemyPlayer.boardHTML.children) {
    if (index === e.target) {
      break;
    }
    eIndex++;
  }

  e.target.classList.add('miss');
  if(enemyPlayer.board[eIndex] == 0) {
  }

  if(enemyPlayer.board[eIndex] == 1) {
    e.target.classList.add('dead');
  }
  enemyTurn();
})


// end
////////////////////////////////

/////////////////////////////////
// Enemy turn

function enemyTurn() {
  let shot = Math.round(Math.random() * 128);
  if(mainPlayer.board[shot] == 1) {
    mainPlayer.boardHTML.children[shot].classList.add('dead');
  } else if(mainPlayer.board[shot] == 2) {
    enemyTurn(); return;
  } else if (mainPlayer.board[shot] == 0) {
    if(mainPlayer.boardHTML.children[shot].classList.contains('miss')) {enemyTurn(); return};
    mainPlayer.boardHTML.children[shot].classList.add('miss');
  }
}




initializationGameData();
// generateRandomShips(mainPlayer);
// generateRandomShips(enemyPlayer);
// renderBoard(mainPlayer);