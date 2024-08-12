const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');  // Update this path to match your project structure

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token,"token----------------------------")
        const decoded = jwt.verify(token, 'yourSecretKey');  // Make sure this secret key matches the one used when creating tokens
        const admin = await Admin.findById(decoded._id);

        if (!admin) {
            throw new Error();
        }

        req.token = token;
        req.admin = admin;  // Change 'user' to 'admin'
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;
