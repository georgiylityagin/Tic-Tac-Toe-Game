const boardSize = 600;
const gridSize = 3;
const step = boardSize / gridSize;
const backgroundColor = 50;
const primaryColor = 255;
const players = ['X', 'O'];

let board = createBoard(gridSize);
let currentPlayer = players[0];
let currentTurn = 0;
let available = [];
let playerInfo;

function setup() {
    let canvas = createCanvas(boardSize, boardSize);
    canvas.parent('canvas-holder');

    canvas.mousePressed(nextTurn);

    let resetButton = select('#reset');
    resetButton.mousePressed(startNewGame);

    playerInfo = createP();
    playerInfo.parent('playerInfo');
    playerInfo.position(650, 50);
    playerInfo.html(`'${currentPlayer}' turn`);
}

function draw() {
    background(backgroundColor);

    stroke(primaryColor);
    strokeWeight(3);
    fill(backgroundColor);

    makeGrid();
    showBoard();
    checkWinner();
}

function startNewGame() {
    board = createBoard(gridSize);
    currentPlayer = players[0];
    currentTurn = 0;
    available = [];
    playerInfo.html(`'${currentPlayer}' turn`);
    loop();
}

function nextTurn() {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    for (let j = 0; j < boardSize; j++) {
        for (let i = 0; i < boardSize; i++) {
            let xmin = i * step;
            let xmax = i * step + step;
            let ymin = j * step;
            let ymax = j * step + step;

            if ((mouseX > xmin && mouseX < xmax && mouseY > ymin && mouseY < ymax) && !available.includes(''+i+j)) {
                board[i][j] = currentPlayer;
                currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
                currentTurn++;
                available.push(''+i+j);
                playerInfo.html(`'${currentPlayer}' turn`);
            }
        }
    }
}

function makeGrid() {
    for (let i = 0; i < gridSize - 1; i++) {
        line(i * step + step, 0, i * step + step, boardSize);
        line(0, i * step + step, boardSize, i * step + step);
    }
}

function showBoard() {
    for (let j = 0; j < gridSize; j++) {
        for (let i = 0; i < gridSize; i++) {
            let x = i * step + step / 2;
            let y = j * step + step / 2;
            let spot = board[i][j];

            if (spot === players[1]) {
                ellipse(x, y, step / 2);
            } else if (spot === players[0]) {
                line(x - step / 4, y - step / 4, x + step / 4, y + step / 4);
                line(x - step / 4, y + step / 4, x + step / 4, y - step / 4);
            }
        }
    }
}

function createBoard(gridSize) {
    let board = [];

    for (let j = 0; j < gridSize; j++) {
        let boardInner = [];
        for (let i = 0; i < gridSize; i++) {
            boardInner[i] = null;
        }
        board[j] = boardInner;
    }

    return board;
}

function checkWinner() {
    let winner;
    stroke('red');
    strokeWeight(4);
        
    for (let i = 0; i < gridSize; i++) {
        // Check vertical and horizontal lines
        if (equal3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
            line(i * step + step / 2, 0 * step + step / 4, i * step + step / 2, 3 * step - step / 4);

        } else if (equal3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
            line(0 * step + step / 4, i * step + step / 2, 3 * step - step / 4, i * step + step / 2);
        }
    }

    // Check diagonal lines
    if (equal3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
        line(0 * step + step / 4, 0 * step + step / 4, 3 * step - step / 4, 3 * step - step / 4);
    } else if (equal3(board[0][2], board[1][1], board[2][0])) {
        winner = board[0][2];
        line(0 * step + step / 4, 3 * step - step / 4, 3 * step - step / 4, 0 * step + step / 4);
    }

    if (winner != null) {
        playerInfo.html(`Player '${winner}' wins!`);
        noLoop();
    } else if (currentTurn === gridSize ** 2) {
        playerInfo.html(`Draw`);
        noLoop();
    }
}

function equal3(a, b, c) {
    return (a === b && b === c && a !== null);
}