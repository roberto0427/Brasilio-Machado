const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Solicitar nome do jogador
let playerName = prompt("Digite seu nome:");
if (!playerName) playerName = "Jogador";

// Variáveis do jogo
let bird = { x: 50, y: 300, width: 40, height: 20, velocity: 0 };
let gravity = 0.5;
let jump = -10;
let pipes = [];
let pipeWidth = 60;
let pipeGap = 170; // Espaço maior entre os tubos
let frame = 0;
let score = 0;
let gameOver = false;

// Sistema de ranking
let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

// Função para desenhar o pássaro
function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Função para desenhar os tubos
function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
    });
}

// Função para atualizar os tubos
function updatePipes() {
    if (frame % 100 === 0) {
        let top = Math.random() * (canvas.height - pipeGap - 50) + 15;
        pipes.push({ x: canvas.width, top });
    }
    pipes.forEach(pipe => pipe.x -= 2);
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Função para detectar colisões
function detectCollision() {
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }
    pipes.forEach(pipe => {
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)
        ) {
            gameOver = true;
        }
    });
}

// Função para atualizar o ranking
function updateRanking() {
    const existingPlayer = ranking.find(player => player.name === playerName);
    if (existingPlayer) {
        existingPlayer.score = Math.max(existingPlayer.score, score);
    } else {
        ranking.push({ name: playerName, score });
    }
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 5);
    localStorage.setItem('ranking', JSON.stringify(ranking));
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = ranking.map(player => `<li>${player.name}: ${player.score}</li>`).join('');
}

// Função principal do jogo
function gameLoop() {
    if (gameOver) {
        updateRanking();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += gravity;
    bird.y += bird.velocity;

    drawBird();
    updatePipes();
    drawPipes();
    detectCollision();

    pipes.forEach(pipe => {
        if (pipe.x + pipeWidth === bird.x) {
            score++; // Incrementa a pontuação ao passar por um tubo
        }
    });

    frame++;
    requestAnimationFrame(gameLoop);
}

// Controle de salto
document.addEventListener('keydown', () => {
    if (!gameOver) bird.velocity = jump;
    else {
        bird = { x: 50, y: 300, width: 20, height: 20, velocity: 0 };
        pipes = [];
        score = 0;
        frame = 0;
        gameOver = false;
        gameLoop();
    }
});

// Inicializar o jogo
updateRanking();
gameLoop();