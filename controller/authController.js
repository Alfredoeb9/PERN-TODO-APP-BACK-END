const jwt = require("jsonwebtoken");
const { relativeTimeRounding } = require("moment");
const { registerUser, loginUser } = require("../models/userModel")
const { emailRegex, getCurrentDateTime } = require("../lib/utils/utils");
const {
    sendVerifyingUserEmail
  } = require("../lib/mailer");
const userModel = require("../models/userModel");
const pool = require("../db");

const createToken = async(_id, isAdmin) => {
    return jwt.sign({ _id, isAdmin: isAdmin }, process.env.JWT_SECRET);
};

const register = async (req, res, next) => {
    
    try {
        
        const { username, firstName, lastName, email, password, isAdmin } = req.body;
        
        const isValidEamil = await emailRegex(email);
        if (!isValidEamil) throw Error("Please provide a proper email")

        const newUser = await registerUser(
            username,
            firstName,
            lastName,
            email,
            password,
            isAdmin
        );
        // Create a token per user
        const token = await createToken(newUser, false);

        const currentUser = await pool.query(`SELECT * FROM users WHERE email = $1;`, [email])

        const link = `${process.env.REACT_APP_AUTH_BASE_URL}/verify-email/${token}`;
        const fullName = currentUser.rows[0].firstName + " " + currentUser.rows[0].lastName;


        await sendVerifyingUserEmail(currentUser.rows[0].email, fullName, link)

        return res.status(200).json({ email, token, msg: "Email verification sent..."})
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
};

const login = async(req, res, next) => {
    try {
        const { email } = req.body;
        const user = await loginUser(email, req.body.password);

        const token = await createToken(user, user.rows[0].isAdmin);

        // const verification = {
        //     token: token,
        //     expireTime: addTime(1, getCurrentDateTime(), "hours"),
        //     isVerified: true
        // };

        // const updatedUser = await updateVerification(
        //     { _id: user.rows[0].id },
        //     { verification }
        // );

        const { password, isAdmin, ...otherDetails } = user.rows[0];

        return res.status(200).json({ email, token, ...otherDetails, isAdmin });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// const updatedUser = async(req, res, next) => {
//     const { firstName, lastName, email } = req.body;

//     try {
//         const newUpdatedUser = await 
//     } catch (error) {
//         return res.status(401).json({ error: error.message })
//     }
// }

module.exports = {
    register,
    login
};