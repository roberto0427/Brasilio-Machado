const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 500;

// Variáveis do jogo
let snake = [{ x: 400, y: 300 }]; // Corpo da cobra
let direction = { x: 0, y: 0 }; // Direção inicial
let food = { x: 200, y: 200 }; // Posição inicial da comida
let score = 0;
const snakeSize = 20;
let snakeColor = 'lime'; // Cor inicial da cobra

// Função para desenhar a cobra
function drawSnake() {
    ctx.fillStyle = snakeColor;
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });
}

// Função para desenhar a comida
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

// Função para movimentar a cobra
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateSnakeColor(); // Atualiza a cor da cobra com base na pontuação
        placeFood();
    } else {
        snake.pop(); // Remove o último segmento se não comer
    }
}

// Função para posicionar a comida aleatoriamente
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    food.y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
}

// Função para detectar colisões
function checkCollision() {
    const head = snake[0];

    // Colisão com bordas
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // Colisão com o próprio corpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Função para reiniciar o jogo
function resetGame() {
    snake = [{ x: 400, y: 300 }];
    direction = { x: 0, y: 0 };
    score = 0;
    snakeColor = 'lime'; // Reseta a cor da cobra
    placeFood();
}

// Função para atualizar a cor da cobra com base na pontuação
function updateSnakeColor() {
    if (score >= 10) {
        snakeColor = 'blue';
    } else if (score >= 20) {
        snakeColor = 'purple';
    } else if (score >= 30) {
        snakeColor = 'gold';
    } else {
        snakeColor = 'lime';
    }
}

// Função principal do jogo
function gameLoop() {
    if (checkCollision()) {
        resetGame(); // Reinicia o jogo ao detectar colisão
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();

    setTimeout(gameLoop, 100); // Controla a velocidade do jogo
}

// Controle de direção
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp': // Tecla de seta para cima
        case 'w': // Tecla W
            if (direction.y === 0) direction = { x: 0, y: -snakeSize };
            break;
        case 'ArrowDown': // Tecla de seta para baixo
        case 's': // Tecla S
            if (direction.y === 0) direction = { x: 0, y: snakeSize };
            break;
        case 'ArrowLeft': // Tecla de seta para esquerda
        case 'a': // Tecla A
            if (direction.x === 0) direction = { x: -snakeSize, y: 0 };
            break;
        case 'ArrowRight': // Tecla de seta para direita
        case 'd': // Tecla D
            if (direction.x === 0) direction = { x: snakeSize, y: 0 };
            break;
    }
});

// Função para abrir a lojinha
function openShop() {
    alert('Bem-vindo à lojinha! Aqui você pode comprar skins para sua cobra.');
    // Aqui você pode implementar lógica adicional para trocar skins
}

// Cria o botão para abrir a lojinha
const shopButton = document.createElement('button');
shopButton.innerText = 'Abrir Lojinha';
shopButton.style.position = 'absolute';
shopButton.style.top = '10px';
shopButton.style.left = '10px';
shopButton.addEventListener('click', openShop);
document.body.appendChild(shopButton);

// Inicializa o jogo
placeFood();
gameLoop();