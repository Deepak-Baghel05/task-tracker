const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // check if user exists
        let user = await User.findOne({ email });
        if (user) {
            res.redirect('/register');
            return res.redirect('/register?error=User already exists');
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        //res.send('User Registered Successfully');
        res.redirect('/login');

    } catch (err) {
        console.log(err);
        res.send('Error');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            //res.redirect('/login');
            //return res.send('User not found');
            return res.redirect('/login?error=User not found');
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.redirect('/login');
            //return res.send('Invalid credentials');
        }

        // store user in session
        req.session.userId = user._id;

        //res.send('Login Successful');
        res.redirect('/tasks');

    } catch (err) {
        console.log(err);
        res.send('Error');
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        //res.send('Logged out');
        return res.redirect('/register');
    });
};