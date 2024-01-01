const symbols = ['!','@','#','$','%','^','&','*','(',')','+'];
const state = {
    secret: Array.from({ length: 5 }, () => getRandomSymbol()).join(''),
    grid: Array (6)
        .fill()
        .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

function getRandomSymbol() {
    if (symbols.length === 0) {
        symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+'];
    }
    const randomIndex = Math.floor(Math.random() * symbols.length);
    const selectedSymbol = symbols[randomIndex];
    symbols.splice(randomIndex, 1);
    return selectedSymbol;
}


function displaySecret() {
    const secretRow = document.createElement('div');
    secretRow.className = 'grid secret-row';
    
    for (let i = 0; i < 5; i++) {
        const box = drawBox(secretRow, 0, i, state.secret[i]);
        box.classList.add('animated-bounce', 'right');

        const delay = i * 0.1; // Adjust the delay as needed
        box.style.animationDelay = `${delay}s`;
    }
    game.appendChild(secretRow);
}

function removeSecret() {
    const secretRow = document.querySelector('.secret-row');
    if (secretRow) {
        game.removeChild(secretRow);
    }
}

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById (`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox (container, row, col, symbol = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = symbol;

    container.appendChild(box);
    return box;
}

function drawGrid (container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            drawBox(grid, i, j);
        }
    }

    container.appendChild(grid);
}

function registerkeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === 'Enter') {
            if (state.currentCol === 5) {
                const pattern = getCurrentPattern();
                if (isPatternValid(pattern)) {
                    revealPattern(pattern);
                    state.currentRow++;
                    state.currentCol = 0;
                } 
            }
        }
        if (key === 'Backspace') {
            removeSymbol();
        }
        if (isSymbol(key)) {
            addSymbol(key);
        }

        updateGrid();
    };
}

function getCurrentPattern() {
    return state.grid[state.currentRow].reduce((prev,curr) => prev + curr);
}

function isPatternValid(pattern) {
    return !pattern.includes(' '); 
}

function revealPattern (guess) {
    const row = state.currentRow;
    const animation_duration = 500; //ms

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const symbol = box.textContent;

        setTimeout(() => {
            if (symbol === state.secret[i]) {
                box.classList.add('right');
            } else if (state.secret.includes(symbol)) {
                box.classList.add('wrong');
            } else if (symbols.includes(symbol)) {
                box.classList.add('empty');
            } else {
                box.classList.add('invalid');
            }
            box.classList.add('animated-guess');
        }, ((i + 1) * animation_duration) / 2);
        
        box.classList.add('animated-guess');
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    setTimeout(() => {
        if (isWinner) {
            alert('Congratulations!')
        } else if (isGameOver) {
            alert(`Nice Try! Unfortunately, the pattern was ${state.secret}.`);
        }
    }, 3 * animation_duration);
}

function isSymbol(key) {
    return key.length === 1 && key.match(/\W/);
}

function addSymbol (symbol) {
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = symbol;
    state.currentCol++;
}

function removeSymbol () {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}


function startup() {
    const game = document.getElementById('game');
    drawGrid(game);

    displaySecret();

    setTimeout(() => {
        removeSecret();
        game.classList.add('grid-visible'); 
        registerkeyboardEvents();
    }, 5000);

    console.log(state.secret); // test to see answer
}

startup();