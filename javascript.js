// This is an IIFE. Pretty much the same as saying
// function createBoard() {
//    //do the stuff btwn the purple curly braces
// }
// and then saying "board = createGameboard"
const board = (() => {
    const board = [];

    function setCallback(callback) {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.addEventListener('click', function() {
                x = square.id.charAt(1)
                y = square.id.charAt(3)
                callback(x, y);
            });
        });
    }
    
    function createSquare(x, y) {
        return { x: x, y: y, symbol: "" };
    }

    const rows = 3;
    const cols = 3;
    const container = document.querySelector('.container');
    for (let x = 0; x < rows; x++) {
        board[x] = [];
        for (let y = 0; y < cols; y++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("id", `r${x}c${y}`)
            container.appendChild(square);
            board[x][y] = createSquare(x, y);
        }
    }

    // ONLY THIS function INTERACTS WITH DOM
    function setSymbol(x, y, symbol) {
        if ( symbol === "" || board[x][y].symbol === "") {
            board[x][y].symbol = symbol;
            let theSquare = document.querySelector(`#r${x}c${y}`);
            theSquare.textContent = symbol;
            return true;
        }
        return false;
    }

    function getRow(x) {
        const vals = [];
        for (let y = 0; y < cols; y++) {
            vals.push(board[x][y].symbol);
        }
        return vals;
    }

    function getCol(y) {
        const vals = [];
        for (let x = 0; x < rows; x++) {
            vals.push(board[x][y].symbol);
        }
        return vals;
    }

    function getFallingDiagonal() {
        const vals = [];
        for (let i = 0; i < rows; i++) {
            vals.push(board[i][i].symbol);
        }
        return vals;
    }

    function getRisingDiagonal() {
        const vals = [];
        for (let i = 2; i >= 0; i--) {
            vals.push(board[i][2-i].symbol);
        }
        return vals;
    }

    function reset(){
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                setSymbol(x, y, "");
            }
        }
    }
    
    return {
        reset,
        setSymbol,
        getRow,
        getCol,
        getFallingDiagonal,
        getRisingDiagonal,
        setCallback,
    }
})();

function createPlayer(name, symbol) {
    return {
        name: name,
        symbol: symbol,
        wins: 0,
    }
}

const createGameController = (() => {
    const playerX = createPlayer("playerX", "X");
    const playerO = createPlayer("playerO", "O");
    let currentPlayer = playerX;
    let chosenSquares = 0;
    let inGame = true;
    const modal = document.querySelector('#winner-modal');
    const resetBtn = document.querySelector('#reset-btn');
    const winnerText = document.querySelector('#winner-msg');

    function swapTurn() {
        currentPlayer === playerX ? currentPlayer = playerO : currentPlayer = playerX;
    }

    function checkForWin(lastX, lastY) {
        const row = board.getRow(lastX);
        if (row.every((val) => val === row[0])) {
            console.log("Row winner");
            return true;
        }
        const col = board.getCol(lastY);
        if (col.every((val) => val === col[0])) {
            console.log("Column winner");
            return true;
        }
        if (lastX === lastY) {
            const fallingDiag = board.getFallingDiagonal();
            if (fallingDiag.every((val) => val === fallingDiag[0])) {
                console.log("Falling diag winner");
                return true;
            }
        }
        // Prepend with "+" to change from string to int
        if (+lastX + +lastY === 2) {
            const risingDiag = board.getRisingDiagonal();
            if (risingDiag.every((val) => val === risingDiag[0])) {
                console.log("Rising diag winner");
                return true;
            }
        }
        return false;
    }

    function showWinner(name) {
        inGame = false;
        winnerText.textContent = `${name} WINS!`;
        modal.classList.remove('hidden');
    }

    function showTie() {
        inGame = false;
        winnerText.textContent = 'Tie Game!';
        modal.classList.remove('hidden');
    }

    resetBtn.onclick = () => {
        inGame = true;
        modal.classList.add('hidden');
        board.reset();
        chosenSquares = 0;
    };

    function playGame() {
        callback = function(x, y) {
            if (!inGame) return;
            if (board.setSymbol(x, y, currentPlayer.symbol)) {
                chosenSquares++;
                if (chosenSquares === 9){
                    showTie();
                }
                if (checkForWin(x, y)) {
                    showWinner(currentPlayer.name);
                } else {
                    swapTurn();
                }
            };
        };
        board.setCallback(callback);
    }

    playGame();
})();

