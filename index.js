
// 128 клеток
// 0 - пусто 1 - корабль 2 - уничтожен

////////////////////////////////////////////////////////////////
// initialization

let mainPlayer = {
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
  force: [],
  boardHTML: document.querySelector('.board__main'),
};

let enemyPlayer = {
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
  force: [],
  boardHTML: document.querySelector('.board__enemy'),
};

function Ship(player, size) {
  this.size = size;
  this.player = player;
  this.position = [];
  this.isAlive = true;
  this.setPosition = function (position) {
    for (const iterator of position) {
      this.position.push({pos: iterator, isBroken: false});
    }
  }
  this.hitted = function (position) {
    for (const iterator of this.position) {
      if(iterator.isBroken) {
        continue;
      }

      if(iterator.pos === position) {
        iterator.isBroken = true;
        this.isAlive = this.checkAlive();
        if( this.isAlive ) { return }
      }
    }
    this.dead();
  }
  this.checkAlive = function() {
    for (const iterator of this.position) {
      if(!iterator.isBroken) {
        return true;
      }
    }
    return false;
  }
  this.dead = function() {
    for (const iterator of this.position) {
      this.player.boardHTML.children[shiftDirection.top(iterator.pos)].classList.add('miss');
      this.player.boardHTML.children[shiftDirection.top(iterator.pos - 1)] .classList.add('miss');
      this.player.boardHTML.children[shiftDirection.top(iterator.pos + 1)].classList.add('miss');
      this.player.boardHTML.children[shiftDirection.bottom(iterator.pos)].classList.add('miss');
      this.player.boardHTML.children[shiftDirection.bottom(iterator.pos - 1)].classList.add('miss');
      this.player.boardHTML.children[shiftDirection.bottom(iterator.pos + 1)].classList.add('miss');
      this.player.boardHTML.children[shiftDirection.left(iterator.pos)].classList.add('miss');
      this.player.boardHTML.children[shiftDirection.right(iterator.pos)].classList.add('miss');
      this.player.boardHTML.children[iterator.pos].classList.remove('miss');
    }
    renderBoard(this.player);
    this.amILast();
  }
  this.amILast = function () {
    for (const ship of this.player.force) {
      if(ship.isAlive) { return }
    }
    if(this.player == mainPlayer) {
      alert("Lose");
    } else {
      alert("Victory!");
    }
      initializationGameData();
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

  mainPlayer.force = []; mainPlayer.board.fill(0);
  for (const iterator of mainPlayer.boardHTML.children) {
    iterator.classList.remove('miss'); iterator.classList.remove('ship'); iterator.classList.remove('dead');
  }
  
  mainPlayer.force.push(new Ship(mainPlayer, 2), new Ship(mainPlayer, 2));
  mainPlayer.force.push(new Ship(mainPlayer, 3), new Ship(mainPlayer, 3),);
  mainPlayer.force.push(new Ship(mainPlayer, 4));

  generateRandomShips(mainPlayer);

  renderBoard(mainPlayer);
  

  enemyPlayer.force = []; enemyPlayer.board.fill(0);
  for (const iterator of enemyPlayer.boardHTML.children) {
    iterator.classList.remove('miss'); iterator.classList.remove('ship'); iterator.classList.remove('dead');
  }

  enemyPlayer.force.push(new Ship(enemyPlayer, 2), new Ship(enemyPlayer, 2));
  enemyPlayer.force.push(new Ship(enemyPlayer, 3), new Ship(enemyPlayer, 3),);
  enemyPlayer.force.push(new Ship(enemyPlayer, 4));

  generateRandomShips(enemyPlayer);

  renderBoard(enemyPlayer);

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

    let shipArr = [];
    shipArr.push(start);
    let curPos = start;
    board[curPos] = 1;

    for(let i = 1; i < ship.size; i++) {
      curPos = shiftToNumberDirection(curPos, shipDirection);
      board[curPos] = 1;
      shipArr.push(curPos);
    }
    ship.setPosition(shipArr);
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
    case 1:
      return shiftDirection.bottom(shift);
    case 2:
      return shiftDirection.left(shift);
    case 3:
      return shiftDirection.right(shift);
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

/**
 * Перерисовывает HTML в соответствии с матрицей игрока
 * @param {object} player 
 */
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

  if(enemyPlayer.board[eIndex] == 0) {
    e.target.classList.add('miss');
    enemyTurn();
  }

  if(enemyPlayer.board[eIndex] == 1) {
    e.target.classList.add('dead');

    let curShip = false;

    for (const ship of enemyPlayer.force) {
      for (const pos of ship.position) {
        if(pos.pos === eIndex) {
          curShip = ship;
          break;
        }
      }
      if(curShip) {break};
    }

    curShip.hitted(eIndex);
  }
})


// end
////////////////////////////////

/////////////////////////////////
// Enemy turn

function enemyTurn() {
  let shot = Math.round(Math.random() * 98 + 16);
  if(mainPlayer.board[shot] == 1) {
    mainPlayer.boardHTML.children[shot].classList.add('dead');

    let curShip = false;

    for (const ship of mainPlayer.force) {
      for (const pos of ship.position) {
        if(pos.pos === shot) {
          curShip = ship;
          break;
        }
      }
      if(curShip) {break};
    }

    curShip.hitted(shot);

    enemyTurn();
    return;
  } else if(mainPlayer.board[shot] == 2) {
    enemyTurn(); return;
  } else if (mainPlayer.board[shot] == 0) {
    if(mainPlayer.boardHTML.children[shot].classList.contains('miss')) {enemyTurn(); return};
    mainPlayer.boardHTML.children[shot].classList.add('miss');
  }
}


////////////////////////////////////////////////////////////////
// start game

initializationGameData();