const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const validator = require("validator");
const pool = require('../db');

module.exports = {
    registerUser: async(id, username, firstName, lastName, email, password, isAdmin) => {
        try {
            //Find an email within the database
            const emailExists = await pool.query(`SELECT * FROM users WHERE email = $1;`, [email]);

            if (emailExists.rowCount === 1) throw Error("Email has been found, please sign in");

            // const uuidExists = await pool.query(`SELECT * FROM users WHERE id = $1;`, [id]);

            // if (uuidExists.rowCount === 1) {
            //     id = uuidv4()
            //     return id;
            // }

            if (!email || !password) throw Error("All fields must be filled");

            if (!validator.isEmail(email)) throw Error("Email is not valid");

            if (!validator.isStrongPassword(password)) throw Error("Password not strong enough");

            // SALT: attaches a random string at the end
            const salt = await bcrypt.genSalt();

            // create a has and attach password + hash
            const hash = await bcrypt.hash(password, salt);

            const newUser = await pool.query(`INSERT INTO users (username, firstName, lastName, email, hashed_password, isAdmin) VALUES($1, $2, $3, $4, $5, $6);`, [username, firstName, lastName, email, hash, isAdmin]);
            return newUser;
        } catch (error) {
            console.log("error from model", error)
        }
        
    },

    loginUser: async (email, password) => {
        // Validation
        if(!email || !password) throw Error("All fields must be filled");

        const user = await pool.query(`SELECT * FROM users WHERE email = $1;`, [email]);
        if(!user) throw Error("Incorrect login credentials");

        // need to match the password with hash password
        const passwordMatch = await bcrypt.compare(password, user.rows[0].hashed_password);

        if(!passwordMatch) throw Error("Incorrect login credentials");

        return user;
    },

    // verifyEmail: async (_id, body) => {
    //     const result = await pool.query()
    // }

    // updateVerification: async (_id, body) => {
    //     const result = await pool.query(`UPDATE users SET username = ?, firstName = ?, lastName = ?, email = ?, password = ?, isAdmin = ? WHERE _id = ?;`,[
    //         body.
    //     ])
    // }
}