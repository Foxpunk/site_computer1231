// Проверка авторизации пользователя
window.onload = function() {
    checkLoginStatus();
};

// Проверка авторизован ли пользователь
function checkLoginStatus() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
        showWelcomeMessage();
    } else {
        showLoginForm();
    }
}

// Отображение приветственного сообщения
function showWelcomeMessage() {
    document.querySelector('.welcome-message').style.display = 'block';
    document.querySelector('.auth-buttons').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'block';
}

// Отображение формы входа
function showLoginForm() {
    document.querySelector('.login-form').style.display = 'block';
    document.querySelector('.auth-buttons').style.display = 'block';
}

// Вход в систему
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Username:', username); // Добавьте вывод в консоль
    console.log('Password:', password); // Добавьте вывод в консоль

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = 'index.html'; // Перенаправление на главную страницу
        } else {
            alert('Неверные данные для входа');
        }
    })
    .catch(error => console.error('Ошибка при запросе:', error));
}


// Регистрация пользователя
function register(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Username:', username); // Выводим имя пользователя
    console.log('Password:', password); // Выводим пароль

    // Проверяем, что поля не пустые
    if (!username || !password) {
        alert('Имя пользователя и пароль не могут быть пустыми');
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Регистрация прошла успешно');
            window.location.href = 'login.html'; // Перенаправление на страницу логина
        } else {
            alert('Ошибка регистрации: ' + data.message);
        }
    })
    .catch(error => console.error('Ошибка при запросе:', error));
}


// Выход из системы
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    checkLoginStatus();
}

// Покупка товара
function purchaseProduct(productName) {
    if (localStorage.getItem('loggedIn') === 'true') {
        fetch('/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Покупка успешна!');
            } else {
                alert('Ошибка при покупке');
            }
        })
        .catch(error => console.error('Ошибка при отправке запроса:', error));
    } else {
        alert('Вы должны быть авторизованы для совершения покупки');
    }
}
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // предотвращает стандартную отправку формы

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Проверка на пустые поля
    if (!username || !password) {
        alert('Имя пользователя и пароль не могут быть пустыми');
        return;
    }

    // Отправка данных на сервер
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Регистрация успешна');
            window.location.href = 'login.html'; // Перенаправление на страницу логина
        } else {
            alert(data.message); // Сообщение об ошибке от сервера
        }
    })
    .catch(error => {
        console.error('Ошибка при отправке запроса:', error);
    });
});
