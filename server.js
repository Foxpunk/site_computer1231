const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); // Для CORS
const app = express();

// Настройка парсинга JSON и CORS
app.use(bodyParser.json());
app.use(cors());  // Разрешает CORS-запросы

// Подключение к базе данных
const db = new sqlite3.Database('1231.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных: ', err.message);
        return;
    }
    console.log('Подключение к базе данных установлено');
});

// Маршрут для регистрации
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  console.log('Получены данные регистрации:', req.body); // Логируем полученные данные

  // Проверка, что поля не пустые
  if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Имя пользователя и пароль не могут быть пустыми' });
  }

  // Проверка на существование пользователя
  const sqlCheck = 'SELECT * FROM users WHERE name = ?';
  db.get(sqlCheck, [username], (err, row) => {
      if (err) {
          console.error('Ошибка базы данных:', err.message);
          return res.status(500).json({ success: false, message: 'Ошибка базы данных' });
      }
      if (row) {
          // Если пользователь уже существует
          return res.status(400).json({ success: false, message: 'Пользователь с таким именем уже существует' });
      }

      // Если пользователя нет, то добавляем его в базу данных
      const sqlInsert = 'INSERT INTO users (name, password) VALUES (?, ?)';
      db.run(sqlInsert, [username, password], function (err) {
          if (err) {
              console.error('Ошибка при добавлении пользователя:', err.message);
              return res.status(500).json({ success: false, message: 'Ошибка при регистрации' });
          }
          res.status(200).json({ success: true, message: 'Регистрация прошла успешно' });
      });
  });
});



// Маршрут для входа
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Получены данные: ${JSON.stringify(req.body)}`);  // Логируем тело запроса

  // Проверка на пустые значения
  if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Имя пользователя и пароль не могут быть пустыми' });
  }

  const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';
  db.get(sql, [username, password], (err, row) => {
      if (err) {
          console.error('Ошибка базы данных при запросе логина: ', err.message);
          return res.status(500).json({ success: false, message: 'Ошибка базы данных' });
      }
      if (!row) {
          console.log('Пользователь не найден');
          return res.status(401).json({ success: false, message: 'Неверное имя пользователя или пароль' });
      }
      console.log('Пользователь найден:', row);
      res.status(200).json({ success: true, message: 'Успешный вход' });
  });
});


// Маршрут для покупки товара
app.post('/purchase', (req, res) => {
    const { productName } = req.body;

    db.get("SELECT * FROM products WHERE name = ?", [productName], (err, row) => {
        if (row && row.quantity > 0) {
            db.run("UPDATE products SET quantity = quantity - 1 WHERE name = ?", [productName], (err) => {
                if (err) {
                    res.json({ success: false });
                } else {
                    res.json({ success: true });
                }
            });
        } else {
            res.json({ success: false, message: 'Товар недоступен' });
        }
    });
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
