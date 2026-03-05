// Everything should fit into three objects:
// Gameboard object holds an array  => wrap into a factory inside an IIFE
// Players will be stored as objects
// GameController (or displayController) object to control game flow

// This is an IIFE. Pretty much the same as saying
// function createBoard() {
//    //do the stuff btwn the purple curly braces
// }
// and then saying "board = createGameboard"
const board = (() => {
    const board = [];

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
            // Attach the "click" event to your button
            square.addEventListener('click', () => {
            // When there is a "click"
            // it shows an alert in the browser
                alert('Oh, you clicked me!')
            })
            container.appendChild(square);
            board[x][y] = createSquare(x, y);
        }
    }

    // left off here: grid draws and looks nice!!


    function setSymbol(x, y, symbol) {
        if (board[x][y].symbol === "") {
            board[x][y].symbol = symbol;
            console.log("Setting symbol")
            return true;
        } else {
            return false;
        }
    }

    function getSymbol(x, y) {
        return board[x][y].symbol;
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
        getSymbol,
        setSymbol,
        getRow,
        getCol,
        getFallingDiagonal,
        getRisingDiagonal,
    }
})();

function createPlayer(name, symbol) {
    return {
        name: name,
        symbol: symbol,
        wins: 0,
    }
}

function getUserInput(player) {
    let x = prompt(player.name + " Enter x:");
    let y = prompt(player.name + " Enter y:");
    console.log("x =", x, " y = ", y, "\n");
    return { x, y };
}

const createGameController = (() => {
    const playerX = createPlayer("playerX", "X");
    const playerO = createPlayer("playerO", "O");
    let currentPlayer = playerX;
    let chosenSquares = 0;

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

    function playGame() {
        let isWinner = false;
        while (!isWinner) {
            let { x, y } = getUserInput(currentPlayer);
            if (board.setSymbol(x, y, currentPlayer.symbol)) {
                chosenSquares++;
            }
            if (checkForWin(x, y)) {
                isWinner = true;
            } else {
                swapTurn();
            }
        }
        console.log(`${currentPlayer.name} WINS!`)
    }

    playGame();
})();

