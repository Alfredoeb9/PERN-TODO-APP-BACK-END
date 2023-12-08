const jwt = require("jsonwebtoken");
const { relativeTimeRounding } = require("moment");
const { registerUser } = require("../models/userModel")
const { emailRegex } = require("../lib/utils/utils");

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

        return res.status(200).json({ email, token, msg: "Email verification sent..."})
    } catch (error) {
        return res.status(400).json({ error: error.message + "testing" })
    }
};

module.exports = {
    register
};