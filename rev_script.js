let realTurn = 0;
let turn = 0;
let comturn = 1;
let mydict = {white: [28,35], black: [27,36]};
const buttons = document.querySelectorAll('.square');
let previousMoves = [];
let res = {};
let checkRowRule = [[0,7],[8,15],[16,23],[24,31],[32,39],[40,47],[48,55],[56,63]];
let checkColRule = [[0,56],[1,57],[2,58],[3,59],[4,60],[5,61],[6,62],[7,63]];
let withCom;



function restartFunction(buttons) {
  for (x=0; x<8; x++) {
    for (y=0; y<8; y++) {
      let myindex = x*8+y;
      let value = buttons[myindex];
      let color = (x+y)%2 === 0 ? 'square0':'square1';

      value.disabled = true;
      value.classList.add(color);
      value.addEventListener('click', () => {
        clickFunction(value, myindex);
      });
    }
  }
}
restartFunction(buttons);


const popup = document.querySelector('.popup');
window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.wholegame').classList.add('wholeblur')
  popup.classList.add('popactive');
})

let com = document.querySelector('.com');
let two = document.querySelector('.two');
com.addEventListener('click', () => {
  addFunction();
  withCom = true;
})

two.addEventListener('click', () => {
  addFunction();
  withCom = false;
})

function addFunction() {
  com.classList.add('active');
  two.classList.add('active');
  popup.classList.remove('popactive');
  document.querySelector('.wholegame').classList.remove('wholeblur');
  findPossibleMoves();
}


function findPossibleMoves() {
  // turn%2
  let whoseTurn = turn%2;
  document.querySelector(`.turn${whoseTurn}`).innerHTML = 'Myturn';
  document.querySelector(`.turn${(whoseTurn+1)%2}`).innerHTML = '';

// turn%2
  const color = turn%2===0 ? ['white','black']:['black','white'];
  const diff = [-9,-8,-7,-1,1,7,8,9];
  const diffxy = [[-1, -1], [ 0, -1], [ 1, -1],
                  [-1,  0],           [ 1,  0],
                  [-1,  1], [ 0,  1], [ 1,  1]];
  // the surrounding position
  let mymoves = mydict[color[0]];
  let yourmoves = mydict[color[1]];


  for (x=0; x<mymoves.length; x++) {
    let stone = mymoves[x];
    let stoneX = stone%8, stoneY = Math.trunc(stone/8);
    let buttonList = [];

    for (i=0; i<8; i++) {
      let value = diff[i]
      let nextStone = stone+value;
      let nextStonex = stoneX+diffxy[i][0], nextStoney = stoneY+diffxy[i][1];

      while (yourmoves.includes(nextStone)){

        buttonList.push(nextStone);
        nextStone += value;
        nextStonex += diffxy[i][0];
        nextStoney += diffxy[i][1];

        // check the surrounding if opposite color is there
        if (!mymoves.includes(nextStone) && !yourmoves.includes(nextStone) && 0<=nextStonex && nextStonex<=7 && 0<=nextStoney && nextStoney<=7) {
          if (nextStone in res) {
            buttonList.forEach((value) => {
              res[nextStone].push(value);
            });
          } else {
            res[nextStone] = buttonList;
          }
        }
      }
      buttonList = [];
    }
  }

  displayPossibleMoves();
}

function displayPossibleMoves() {
  const objectKeys = Object.keys(res);
  if (objectKeys.length < 1) {
    // winner is born
    winnerResult();
  } else if (withCom && turn === 1 && comturn === 0) {

    let mybutton = buttons[20].querySelector('.circle');
    let yourButt = buttons[28].querySelector('.circle');

    mybutton.disabled = false;

    mybutton.classList.add('black-circle');
    yourButt.classList.remove('white-circle');
    yourButt.classList.add('black-circle');

    mydict = {white: [35], black: [27,36,20,28]};

    mybutton.disabled = true;

    turn ++;
    comturn ++;
    res = {};
    findPossibleMoves();

  } else if (!withCom || turn%2 !== comturn) {
    setTimeout(() => {
      objectKeys.forEach((key) => {
        let mybutt = buttons[key];
        previousMoves.push(key);
    
        mybutt.disabled = false;
        mybutt.querySelector('.circle').classList.add('next-circle');
      });
    }, 400);
  }

  // showing next moves
  
}

function clickFunction(mybutt, ind) {
  // turn%2===0
  color = turn % 2 === 0 ? ['white','black']:['black','white'];
  // add stones
  mydict[color[0]].push(Number(ind));

  previousMoves.forEach((sublist) => {
    const subButt = buttons[sublist];

    subButt.querySelector('.circle').classList.remove('next-circle');
    //subButt.innerHTML = '<div class="circle"></div>';
    subButt.disabled = true;
  });
  previousMoves = [];

  // change color
  let values = res[ind];
  mybutt.querySelector('.circle').classList.add(`${color[0]}-circle`);
  //mybutt.innerHTML = `<div class="circle ${color[0]}-circle"></div>`;

  setTimeout(() => {
    values.forEach((butt) => {
      const temporyButt = buttons[butt].querySelector(`.${color[1]}-circle`) || buttons[butt].querySelector(`.${color[0]}active`);
      temporyButt.classList.remove(`${color[0]}active`);
      temporyButt.classList.add(`${color[1]}active`);
  
      mydict[color[0]].push(Number(butt));
      mydict[color[1]].splice(mydict[color[1]].indexOf(butt), 1);
    })
    
    document.querySelector('.marks0').innerHTML = mydict.white.length;
    document.querySelector('.marks1').innerHTML = mydict.black.length;

    res = {};
    turn ++;


    // need to change if // change section
    // turn%2===comturn
    if (withCom && turn % 2 === comturn) {
      findPossibleMoves();
      let maxKey;
      let maxOne = 0;
    
      for (const key in res) {
        if (res[key].length > maxOne) {
          maxKey = key;
          maxOne = res[key].length;
        }
      }
      
      setTimeout(() => {
        buttons[Number(maxKey)].disabled = false;
        buttons[Number(maxKey)].click();
        buttons[Number(maxKey)].disabled = true;
    
        res = {};
        findPossibleMoves();
      }, 1000);

    } else {
      setTimeout(() => {
        findPossibleMoves();
      }, 400);
    }

  }, 400);
}


function winnerResult() {
  const whiteMarks = mydict.white.length;
  const blackMarks = mydict.black.length;

  buttons.forEach((button) => {
    button.disabled = true;
  });

  if (whiteMarks > blackMarks) {
    document.querySelector('.who-won').innerHTML = 'White won!';
  } else if (whiteMarks < blackMarks) {
    document.querySelector('.who-won').innerHTML = 'Black won!';
  } else {
    document.querySelector('.who-won').innerHTML = "It's a tie.";
  }

  document.querySelector('.winner').classList.add('winneractive');
  document.querySelector('.restart').addEventListener('click', clearBoard);
}



function clearBoard() {
  buttons.forEach((button) => {
    button.innerHTML = '<div class="circle"></div>';
  })

  buttons[28].innerHTML = '<div class="circle white-circle"></div>';
  buttons[35].innerHTML = '<div class="circle white-circle"></div>';
  
  buttons[27].innerHTML = '<div class="circle black-circle"></div>';
  buttons[36].innerHTML = '<div class="circle black-circle"></div>';

  realTurn ++;
  turn = realTurn%2;
  comturn = (turn+1)%2;
  mydict = {white: [28,35], black: [27,36]};
  res = {};

  document.querySelector('.marks0').innerHTML = 2;
  document.querySelector('.marks1').innerHTML = 2;
  document.querySelector('.winner').classList.remove('winneractive');

  findPossibleMoves();
}