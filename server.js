const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Para servir archivos estáticos

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'luispardo', // Cambia esto a tu usuario de MySQL
  password: 'Aguapanela1998', // Cambia esto a tu contraseña
  database: 'tienda' // Cambia esto a tu nombre de base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para la raíz que redirige al login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Ruta para servir la página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Aquí deberías validar el usuario en la base de datos
  const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    if (results.length > 0) {
      // Redirigir al home si el login es exitoso
      res.redirect('/home');
    } else {
      // Si hay error, volver al login
      res.redirect('/login');
    }
  });
});

// Ruta para servir el home (productos)
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para obtener productos
app.get('/api/productos', (req, res) => {
  connection.query('SELECT * FROM productos', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

// Ruta para obtener usuarios
app.get('/api/usuarios', (req, res) => {
  connection.query('SELECT * FROM usuarios', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

// Ruta para categorías (puedes añadir las rutas para crear, editar y eliminar)
app.get('/api/categorias', (req, res) => {
  connection.query('SELECT * FROM categorias', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
  connection.query('SELECT * FROM productos', (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.json(results);
  });
});

// Ruta para servir la página de usuarios
app.get('/usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'usuarios.html'));
});
// Ruta para agregar un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const { username, password } = req.body;
  const query = 'INSERT INTO usuarios (username, password) VALUES (?, ?)';
  connection.query(query, [username, password], (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.json({ id: results.insertId, username });
  });
});

// Ruta para eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuarios WHERE id = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.sendStatus(204);
  });
});

// Ruta para agregar un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const { username, password } = req.body;
  const query = 'INSERT INTO usuarios (username, password) VALUES (?, ?)';
  connection.query(query, [username, password], (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.json({ id: results.insertId, username });
  });
});

// Ruta para eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuarios WHERE id = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.sendStatus(204); // No content
  });
});
// Ruta para servir la página del carrito
app.get('/carrito', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'carrito.html'));
});
