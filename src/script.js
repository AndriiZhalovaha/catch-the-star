// Змінні для ігрового стану
let player, star, scoreText, timerText, livesContainer, gameOverMessage;
let score = 0; // Рахунок
let time = 200; // Оновлений таймер на 200 секунд
let lives = 3; // Кількість життів
let isGameOver = false; // Статус гри
let starSpeed = 5; // Початкова швидкість зірочки
let maxStarSpeed = 20; // Максимальна швидкість зірочки

// Ініціалізація гри після натискання кнопки старту
document.getElementById('start-button').addEventListener('click', () => {
    // Ховаємо меню та показуємо ігрове поле
    document.getElementById('menu-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Ініціалізація гри
    initGame();
});

// Ініціалізація ігрових об'єктів та елементів інтерфейсу
function initGame() {
    // Отримання посилань на елементи
    player = document.getElementById('player');
    star = document.getElementById('star');
    scoreText = document.getElementById('score');
    timerText = document.getElementById('timer');
    livesContainer = document.getElementById('lives-container');
    gameOverMessage = document.getElementById('game-over-message');

    // Додаємо життєві іконки (сердечка)
    for (let i = 0; i < 3; i++) {
        let heart = document.createElement('div'); // Створюємо новий елемент для серця
        heart.classList.add('heart'); // Додаємо клас для стилізації
        livesContainer.appendChild(heart); // Додаємо серце в контейнер життів
    }

    // Обробка анімацій та логіки гри
    document.addEventListener('mousemove', onMouseMove); // Додаємо обробник подій для руху миші
    setInterval(updateTimer, 1000); // Оновлюємо таймер кожну секунду
    gameLoop(); // Починаємо ігровий цикл
}

// Головний ігровий цикл
function gameLoop() {
    if (isGameOver) return; // Перевірка, чи гра закінчена

    // Рух зірочки вниз
    let starTop = parseInt(window.getComputedStyle(star).top); // Отримуємо поточну вертикальну позицію зірочки
    starTop += starSpeed; // Додаємо швидкість до позиції зірочки
    star.style.top = starTop + 'px'; // Оновлюємо стилі зірочки

    // Перевірка, чи вийшла зірочка за межі екрану
    if (starTop > window.innerHeight) {
        lives--; // Зменшуємо кількість життів
        livesContainer.removeChild(livesContainer.lastChild); // Видаляємо останнє серце з контейнера
        resetStar(); // Скидаємо зірочку
        if (lives === 0) {
            endGame(); // Кінець гри, якщо життів більше немає
        }
    }

    // Перевірка на зіткнення з гравцем
    if (hitTestRectangle(player, star)) {
        score++; // Збільшуємо рахунок
        scoreText.textContent = `Score: ${score}`; // Оновлюємо текст рахунку
        resetStar(); // Скидаємо зірочку
    }

    // Збільшуємо швидкість зірочки на основі залишкового часу
    let progress = (200 - time) / 200; // Процент часу, що минув
    starSpeed = 5 + progress * (maxStarSpeed - 5); // Обчислюємо нову швидкість зірочки

    // Запускаємо ігровий цикл знову через 16 мс
    setTimeout(gameLoop, 16);
}

// Оновлення таймера кожну секунду
function updateTimer() {
    if (isGameOver) return; // Перевірка, чи гра закінчена
    time--; // Зменшуємо час
    timerText.textContent = `Time: ${time}`; // Оновлюємо текст таймера
    if (time === 0) {
        endGame(); // Кінець гри, якщо час вийшов
    }
}

// Завершення гри
function endGame() {
    isGameOver = true; // Встановлюємо статус гри як завершену
    gameOverMessage.style.display = 'block'; // Показуємо повідомлення про кінець гри
}

// Обробка руху миші
function onMouseMove(e) {
    if (!isGameOver) {
        // Оновлюємо позицію гравця на основі позиції миші
        let rect = document.getElementById('game-container').getBoundingClientRect(); // Отримуємо розміри контейнера гри
        let newLeft = e.clientX - rect.left - 40; // Вираховуємо нову горизонтальну позицію для гравця (враховуємо ширину корабля)
        // Переконуємося, що гравець не виходить за межі ігрового контейнера
        if (newLeft < 0) newLeft = 0;
        if (newLeft > (rect.width - 80)) newLeft = (rect.width - 80); // Враховуємо ширину корабля
        player.style.left = newLeft + 'px'; // Встановлюємо позицію гравця
    }
}

// Скидання зірочки в випадкове положення всередині видимого екрану
function resetStar() {
    star.style.top = '0px'; // Скидаємо зірочку до верхньої частини екрану
    let rect = document.getElementById('game-container').getBoundingClientRect(); // Отримуємо розміри контейнера гри
    let maxLeft = rect.width - 40; // Враховуємо ширину зірочки
    star.style.left = `${Math.random() * maxLeft}px`; // Випадкова горизонтальна позиція
}

// Перевірка на зіткнення між двома елементами
function hitTestRectangle(r1, r2) {
    let r1Rect = r1.getBoundingClientRect(); // Отримуємо розміри та позицію першого прямокутника
    let r2Rect = r2.getBoundingClientRect(); // Отримуємо розміри та позицію другого прямокутника
    // Перевіряємо, чи прямокутники перетинаються
    return !(r1Rect.right < r2Rect.left || 
             r1Rect.left > r2Rect.right || 
             r1Rect.bottom < r2Rect.top || 
             r1Rect.top > r2Rect.bottom);
}
