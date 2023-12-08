const bcrypt = require("bcrypt");
const validator = require("validator");
const pool = require('../db');

module.exports = {
    registerUser: async(username, firstName, lastName, email, password, isAdmin) => {
        try {
            //Find an email within the database
            const exists = await pool.query(`SELECT * FROM users WHERE email = $1;`, [email]);

            if (exists) throw Error("Email has been found, please sign in");

            if (!email || !password) throw Error("All fields must be filled");

            if (!validator.isEmail(email)) throw Error("Email is not valid");

            // SALT: attaches a random string at the end
            const salt = await bcrypt.genSalt();

            // create a has and attach password + hash
            const hash = await bcrypt.hash(password, salt);

            console.log("hash", hash)

            const newUser = await pool.query(`INSERT INTO users (email, hash) VALUES($1, $2);`, [email, hash]);
            return newUser;
        } catch (error) {
            console.log("Error:", error)
        }
        
    }
}