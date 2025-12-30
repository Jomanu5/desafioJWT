const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const {registerUser, verifyUser, getUsers} = require('./consultas');

app.listen(3000, console.log('servidor en puerto 3000'));

app.use(cors());
app.use(express.json());

//middleware para verificar token

app.use((req, res, next) => {
    console.log(`Consulta recibida: ${req.method} en la ruta ${req.url}`);
    next();
});

const validarToken = (req, res, next) => {
    try {
        const Autorization = req.headers('Authorization');
        if(!Autorization){
            throw {code:401, message: 'No autorizado'};
        }
        
        const token = Autorization.split('Bearer ')[1];
        jwt.verify(token, 'secretkey');
        next();
    } catch (error) {
        res.status (401).send({message: 'No autorizado'})
        
    }
}


//registro y login
app.post('/usuarios', async (req, res) => {
    try {
        const usuario = req.body;
        await registerUser(usuario) 
        res.send('Usuario registrado correctamente');
        console.log('Usuario registrado:', usuario.email);
        
    } catch (error) {
        res.status(500).send('Error al registrar el usuario');
        console.error('Error al registrar el usuario:', error);
        
    }

})


app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        await verifyUser(email, password);
        const token = jwt.sign({email}, "secretkey", {expiresIn: '1h'});
        res.json({token});
        console.log('Usuario logueado:', email);
        
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(error.code || 500).send(error.message || 'Error en el login');
        
    }
})

//ruta protegida



app.get('/usuarios', validarToken, async (req, res) => {
    try {
        const token = req.header("Authorization").split("Bearer ")[1];
        const { email } = jwt.decode(token); 
        
        const usuario = await getUser(email);
        res.json([usuario]); 
    } catch (error) {
        res.status(500).send('Error al obtener los datos');
    }
});