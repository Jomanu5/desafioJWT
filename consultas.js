const { pool } = require('pg');
const bcrypt = require('bcrypt');
const { get } = require('node:http');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'softjobs',
    allowExitOnIdle: true
})

const registerUser = async (user) => {
    let {email, password} = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;
    const values = [email, password, rol, lenguage];
    const consulta = 'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)';
    await pool.query (consulta, values);
    return {email, password}; 
}

const verifyUser = async (email, password) => {
    const values = [email];
    const consulta = 'SELECT * FROM usuarios WHERE email = $1';

    const {rows:[usuario], rowCount} = await pool.query(consulta, values);

    const {password: hashedPassword} = usuario;
    passwordMatch = await bcrypt.compare(password, hashedPassword);
    
    if(!passwordMatch || !rowCount){
        throw {code : 401, message: 'Credenciales inválidas'};
    }

}

const getUser = async (email) => {
    const consulta = 'SELECT email, rol, lenguage FROM usuarios WHERE email = $1';
    const { rows: [usuario] } = await pool.query(consulta, [email]);
    return usuario;
};

module.exports = {
    registerUser, verifyUser, getUser
}


    