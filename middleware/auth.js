const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {

    const bearerHeader = req.header('Authorization');

    if (!bearerHeader) {

        return res.status(401).json({
            mensaje: 'Acceso denegado. Token requerido'
        });

    }

    // Separar Bearer del token
    const token = bearerHeader.split(' ')[1];

    try {

        const verified = jwt.verify(token, 'secreto');

        req.usuario = verified;

        next();

    } catch (error) {

        res.status(400).json({
            mensaje: 'Token inválido'
        });

    }

};

module.exports = verificarToken;