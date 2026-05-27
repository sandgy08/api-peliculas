const express = require('express');
const sequelize = require('./database');
const Pelicula = require('./models/Pelicula');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verificarToken = require('./middleware/auth');

const app = express();

app.use(express.json());
// Usuario de prueba
const usuario = {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('123456', 8)
};

app.get('/', (req, res) => {
    res.send('API de Películas funcionando 🚀');
});

// LOGIN
app.post('/login', async (req, res) => {

    const { username, password } = req.body;

    // Verificar usuario
    if (username !== usuario.username) {

        return res.status(400).json({
            mensaje: 'Usuario incorrecto'
        });

    }

    // Verificar contraseña
    const passwordValida = bcrypt.compareSync(password, usuario.password);

    if (!passwordValida) {

        return res.status(400).json({
            mensaje: 'Contraseña incorrecta'
        });

    }

    // Crear token
    const token = jwt.sign(
        {
            id: usuario.id,
            username: usuario.username
        },
        'secreto',
        {
            expiresIn: '1h'
        }
    );

    res.json({
        mensaje: 'Login exitoso',
        token
    });

});

// GET - Obtener películas
app.get('/peliculas', verificarToken, async (req, res) => {
    const peliculas = await Pelicula.findAll();
    res.json(peliculas);
});


// POST - Agregar película
app.post('/peliculas', verificarToken, async (req, res) => {
    const nuevaPelicula = await Pelicula.create(req.body);
    res.json(nuevaPelicula);
});


// PUT - Actualizar película
app.put('/peliculas/:id', verificarToken, async (req, res) => {

    const pelicula = await Pelicula.findByPk(req.params.id);

    if (!pelicula) {
        return res.status(404).json({
            mensaje: 'Película no encontrada'
        });
    }

    await pelicula.update(req.body);

    res.json(pelicula);
});


// DELETE - Eliminar película
app.delete('/peliculas/:id', verificarToken, async (req, res) => {

    const pelicula = await Pelicula.findByPk(req.params.id);

    if (!pelicula) {
        return res.status(404).json({
            mensaje: 'Película no encontrada'
        });
    }

    await pelicula.destroy();

    res.json({
        mensaje: 'Película eliminada'
    });
});


// Crear base de datos
sequelize.sync({ force: true }).then(async () => {

    // Datos iniciales
    await Pelicula.bulkCreate([
        {
            titulo: 'One Piece Film Red',
            genero: 'Anime'
        },
        {
            titulo: 'Avengers Endgame',
            genero: 'Acción'
        },
        {
            titulo: 'Interstellar',
            genero: 'Ciencia ficción'
        },
        {
            titulo: 'Spider-Man No Way Home',
            genero: 'Superhéroes'
        }
    ]);

    app.listen(3000, () => {
        console.log('Servidor corriendo en puerto 3000');
    });

});