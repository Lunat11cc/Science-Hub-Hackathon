const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const salt = 10;

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5001',
  methods: 'GET, POST, PUT, DELETE',
  credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "news_app"
})

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({Error: 'Вы не авторизованы!'});
  } else {
    jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
      if (err) {
        return res.json({Error: 'Ошибка при проверке токена!'});
      } else {
        req.name = decoded.name;
        next();
      }
    })
  }
}

app.get('/', verifyUser, (req, res) => {
  return res.json({Status: 'Успешно!', name: req.name});
})

app.post('/register', (req, res) => {
  const sql = 'INSERT INTO users (`username`, `email`, `password`, `role`) VALUES (?, ?, ?, ?)';
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({Error: 'Ошибка хеширования пароля!'});
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.role
    ]
    db.query(sql, values, (err, result) => {
      if (err) return res.json({Error: 'Ошибка при добавлении данных на сервер!'});
      return res.json({Status: 'Успешно!'});
    })
  })

})

app.post('/login', (req, res) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({Error: 'Ошибка авторизации!'});
    if (data.length > 0) {
      bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
        if (err) return res.json({Error: 'Пароли не совпадают!'});
        if (response) {
          const name = data[0].name;
          const token = jwt.sign({name}, 'jwt-secret-key', {expiresIn: '1d'});
          res.cookie('token', token);
          return res.json({Status: 'Успешно!'});
        } else {
          return res.json({Error: 'Неправильный пароль!'});
        }
      })
    } else {
      return res.json({Error: 'Такого email не существует!'});
    }
  })
})

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({Status: 'Успешно!'})
})

app.get('/api/news', (req, res) => {
  db.query('SELECT * FROM news ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Внутренняя ошибка сервера');
      return;
    }
    res.json(results);
  });
});

app.get('/api/confirm', (req, res) => {
  db.query('SELECT * FROM confirm ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Внутренняя ошибка сервера');
      return;
    }
    res.json(results);
  });
});

app.post('/api/news', (req, res) => {
  const {title, content, author, imageURL} = req.body;
  db.query('INSERT INTO news (title, content, author, img) VALUES (?, ?, ?, ?)', [title, content, author, imageURL], (err) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Внутренняя ошибка сервера');
      return;
    }
    res.json({message: 'Новость успешно добавлена'});
  });
});

app.post('/api/confirm', (req, res) => {
  console.log(req)
  const {title, content, author, imageURL} = req.body;
  const created_at = new Date();
  db.query('INSERT INTO confirm (title, content, created_at, author, img) VALUES (?, ?, ?, ?, ?)', [title, content, created_at, author, imageURL], (err) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Внутренняя ошибка сервера');
      return;
    }
    res.json({message: 'Новость успешно добавлена'});
  });
});

app.delete('/api/news/:id', (req, res) => {
  const newsId = req.params.id;
  db.query('DELETE FROM news WHERE id = ?', [newsId], (err) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Внутренняя ошибка сервера');
      return;
    }
    res.json({message: 'Новость успешно удалена'});
  });
});

app.delete('/api/confirm/:id', (req, res) => {
  const newsId = req.params.id;
  db.query('DELETE FROM confirm WHERE id = ?', [newsId], (err) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Внутренняя ошибка сервера');
      return;
    }
    res.json({message: 'Новость успешно удалена'});
  });
});

app.get('/checkAdminRole', verifyUser, (req, res) => {
  const username = req.query.email;

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Внутренняя ошибка сервера');
      return;
    }

    if (results.length > 0) {
      const userRole = results[0].role;
      if (userRole === 'admin') {
        return res.json({isAdmin: true});
      } else {
        return res.json({isAdmin: false});
      }
    } else {
      return res.json({Error: 'Пользователь не найден или не имеет ролей.'});
    }
  });
});

app.get('/api/user/:email', (req, res) => {
  const userEmail = req.params.email;

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [userEmail], (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Внутренняя ошибка сервера');
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      res.json(user);
    } else {
      return res.json({Error: 'Пользователь не найден.'});
    }
  });
});

app.get('/api/news/:id', (req, res) => {
  const articleId = req.params.id;

  db.query('SELECT * FROM news WHERE id = ?', [articleId], (err, result) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Внутренняя ошибка сервера');
      return;
    }

    if (result.length > 0) {
      const article = result[0];
      res.json(article);
    } else {
      return res.json({Error: 'Статья не найдена.'});
    }
  });
});

app.listen(5000, () => {
  console.log("Сервер запущен...");
})