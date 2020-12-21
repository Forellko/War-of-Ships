
// 128 клеток
// 0 - пусто 1 - корабль 2 - уничтожен

////////////////////////////////////////////////////////////////
// initialization

let enemyBoard = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]

let mainBoard = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]

let mainShips = [
]

let enemyShips = [
]

let ship = {
  size: 0,
  position: [],
}

let mainPlayer = {
  board: mainBoard,
  force: mainShips,
  boardHTML: document.querySelector('.board__main'),
}

let enemyPlayer = {
  board: enemyBoard,
  force: enemyShips,
  boardHTML: document.querySelector('.board__enemy'),
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
  mainPlayer.force.push({size: 2}, {size: 2}, {size: 3}, {size: 4}, {size: 5});
}

// end
////////////////////////////////////////////////////////////////


document.querySelector('.board__enemy').addEventListener('mouseover', function (e) {
  if(e.target === this) {
    return;
  }

  let eIndex = 0;

  for (index of this.children) {
    if (index === e.target) {
      break;
    }
    eIndex++;
  }

})

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
    let start = getRandomStartPosition(board);
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
    document.querySelector('.board__main').children[curPos].classList.add('ship');

    for(let i = 1; i < ship.size; i++) {
      curPos = shiftToNumberDirection(curPos, shipDirection);
      board[curPos] = 1;
      if(board === mainBoard) {
        document.querySelector('.board__main').children[curPos].classList.add('ship');
      }

    }
    done = true;
  }
}

function getRandomStartPosition (board) {
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




initializationGameData();

setInterval(() => {
  generateRandomShips(mainPlayer);
  setTimeout(()=>{clearBoard(mainPlayer.board);
  renderBoard(mainPlayer);}, 1000)
}, 2000)
