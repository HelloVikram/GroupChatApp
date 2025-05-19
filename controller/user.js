const bcrypt = require('bcrypt');
const user = require('../models/user');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
    const { name, email, phone, password } = req.body;
    try {
        if (!name || !email || !phone || !password)
            return res.status(400).json({ success: false, message: 'Please Enter Everything correctly' })
        const User = await user.findAll({ where: { email } });
        if (User.length > 0) {
            return res.status(400).json({ message: 'User already exists,Please Login!' });
        }
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        await user.create({ name, email, phone, password: hash });

        res.status(201).json({ success: true, message: 'Signup Successfull!' })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error in Adding data!!', Error: err })
    }
}
const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const User = await user.findOne({ where: { email } });
        if (!User) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect Password' });
        }
        const token = jwt.sign(
            { id: User.id, email: User.email },
            process.env.JWT_SECRET,
        );
        return res.status(200).json({ success: true, token, username: User.name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
module.exports = { signup, login };