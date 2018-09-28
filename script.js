var player = document.querySelector('.player');
var rolledDice = document.querySelector('.rolledDice');
var rollDiceBtn = document.querySelector('.rollDiceBtn');
var switchBtn = document.querySelector('.switchBtn');
var logs = document.querySelector('.logs');

var ularTangga = document.querySelector('.ularTangga');
var fromPosition = document.querySelector('.fromPosition');
var toPosition = document.querySelector('.toPosition');
var saveBtn = document.querySelector('.saveBtn');
var randomBtn = document.querySelector('.randomBtn');
var startGame = document.querySelector('.startGame');

var boardDiv = document.querySelector('.boardDiv');
var listSnakeLadder = document.querySelector('.listSnakeLadder');
boardDiv.style.whiteSpace = 'pre';
listSnakeLadder.style.whiteSpace = 'pre';
logs.style.whiteSpace = 'pre';

var nowPlaying = 1;
var player1 = {
  player: 'Player 1',
  position: 1
};
var player2 = {
  player: 'Player 2',
  position: 1
};

rollDiceBtn.disabled = true;
switchBtn.disabled = true;

var boards = [];
for (var i = 1; i <= 25; i++) {
  if (i === 1) {
    specialRule = 'START';
  } else if (i === 25) {
    specialRule = 'FINISH';
  } else {
    specialRule = '';
  }
  boards[i] = {
    boardIndex: i,
    nowPlay: '',
    specialRule: specialRule
  };

  if (i === 1) {
    boards[i].nowPlay = 'p1p2'
  }
}
boardDiv.textContent = printBoard();

function printBoard() {
  var printBoard = '';
  for (var i = 25; i > 0; i--) {
    var row = Math.ceil(i / 5);
    if (row % 2 !== 0) {
      for (var j = i - 4; j <= i; j++) {
        printBoard += String(j).padEnd(11, ' ');
      }
      printBoard += '\n';

      for (var j = i - 4; j <= i; j++) {
        var players = boards[j].nowPlay;
        printBoard += players.padEnd(11, ' ');
      }
      printBoard += '\n';

      for (var j = i - 4; j <= i; j++) {
        var rule = boards[j].specialRule;
        printBoard += rule.padEnd(11, ' ');
      }
      printBoard += '\n';

      i -= 4;
    } else {
      for (var j = i; j >= i - 4; j--) {
        printBoard += String(j).padEnd(11, ' ');;
      }
      printBoard += '\n';

      for (var j = i; j >= i - 4; j--) {
        var players = boards[j].nowPlay;
        printBoard += players.padEnd(11, ' ');
      }
      printBoard += '\n';

      for (var j = i; j >= i - 4; j--) {
        var rule = boards[j].specialRule;
        printBoard += rule.padEnd(11, ' ');
      }
      printBoard += '\n';

      i -= 4;
    }
  }
  return printBoard;
}

function rollDice() {
  var dice = Math.floor(Math.random() * 6) + 1;
  rolledDice.textContent = dice;
  play(dice);
}

rollDiceBtn.addEventListener('click', rollDice);

function start() {
  startGame.disabled = true;
  ularTangga.disabled = true;
  fromPosition.disabled = true;
  toPosition.disabled = true;
  saveBtn.disabled = true;
  randomBtn.disabled = true;
  rollDiceBtn.disabled = false;
}
startGame.addEventListener('click', start);

function play(dice) {
  var player = (nowPlaying === 1) ? player1 : player2;
  var position1 = player.position;
  logs.textContent = player.player + ' dari ' + position1;
  player.position += dice;

  if (player.position > 25) {
    player.position = 50 - player.position;
  }

  logs.textContent += ' ke ' + player.position;

  rollDiceBtn.disabled = true;
  switchBtn.disabled = false;

  var specialRule = boards[player.position].specialRule;
  if (specialRule !== "") {
    if (specialRule === "FINISH") {
      rollDiceBtn.disabled = true;
      switchBtn.disabled = true;
      alert(player.player + ' menang!! ');
    } else if (specialRule !== "START" || specialRule !== "FINISH") {
      nextPosition = specialRule.split(',');
      player.position = parseInt(nextPosition[1]);
      logs.textContent += ' ' + nextPosition[0] + ' ke ' + player.position;
    }
  }

  var position2 = player.position;
  boards[position2].nowPlay += 'p' + nowPlaying;
  boards[position1].nowPlay = boards[position1].nowPlay.replace('p' + nowPlaying, '');
  boardDiv.textContent = printBoard();
}

function addRuleManual() {
  var type = ularTangga.value;
  var from = fromPosition.value;
  var to = toPosition.value;
  checkRule(type, from, to, false);
  boardDiv.textContent = printBoard();
}

function addRuleRandom() {
  var tipeRule = ['ular', 'tangga'];
  var randomType = Math.floor(Math.random() * 2);
  var type = tipeRule[randomType];

  var from = Math.floor(Math.random() * 22) + 2;
  var to = Math.floor(Math.random() * 22) + 2;
  try {
    checkRule(type, from, to);
  } catch (e) {
    addRuleRandom();
  }
  boardDiv.textContent = printBoard();
}

function checkRule(type, from, to, random = true) {
  var rule;
  if (from === 1 || from === 25 || to === 1 || to === 25) {
    alert('Ular dan tangga tidak bisa di titik start atau finish');
    throw error;
  } else if (from < 1 || from > 25 || to < 1 || to > 25) {
    alert('Hanya 1-25');
    throw error;
  } else if (from === to) {
    if (random === false) {
      alert('Titik awal dan akhir tidak boleh sama');
    }
    throw error;
  } else {
    var check = boards[from].specialRule;
    if (check === '') {
      if (type === 'ular') {
        rule = Math.floor(from / 5) * 5 - 1;
        if (to > rule) {
          if (random === false) {
            alert('Posisi akhir harus ada di baris bawah posisi awal');
          }
          throw error;
        } else {
          boards[from].specialRule = 'ular,' + to;
          listSnakeLadder.textContent += '\n' + type + ' dari ' + from + ' ke ' + to;
        }
      } else if (type === 'tangga') {
        rule = Math.ceil(from / 5) * 5 + 1;
        if (to < rule) {
          if (random === false) {
            alert('Posisi akhir harus ada di baris atas posisi akhir');
          }
          throw error;
        } else {
          boards[from].specialRule = 'tangga,' + to;
          listSnakeLadder.textContent += '\n' + type + ' dari ' + from + ' ke ' + to;
        }
      }
    } else {
      if (random === false) {
        alert('Sudah ada rule khusus di nomor ' + from);
      }
      throw error;
    }
  }
  return true;
}

saveBtn.addEventListener('click', addRuleManual);

randomBtn.addEventListener('click', addRuleRandom);

function switchPlayer() {
  nowPlaying = (nowPlaying === 1) ? 2 : 1;
  player.textContent = 'Player ' + nowPlaying;
  rolledDice.textContent = '';
  switchBtn.disabled = true;
  rollDiceBtn.disabled = false;
}
switchBtn.addEventListener('click', switchPlayer);