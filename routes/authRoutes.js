const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../controllers/authController');
const User = require('../models/User');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');


router.get('/login', (req, res) => {
    res.render('login');
    //return res.redirect('/tasks');
});
router.get('/register', (req, res) => res.render('register'));

router.post('/register', auth.registerUser);


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
            return res.redirect('/login');
        //return res.send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.redirect('/login');
    }

    req.session.userId = user._id;

    // ✅ THIS IS THE FIX
    res.redirect('/tasks');
});
router.get('/logout', auth.logoutUser);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });
router.post('/profile/update', authMiddleware, upload.single('profileImage'), async (req, res) => {
    const { username, email, password } = req.body;

    let updateData = { username, email };

    if (req.file) {
        updateData.profileImage = '/uploads/' + req.file.filename;
    }

    if (password && password.trim() !== "") {
        const bcrypt = require('bcrypt');
        const hashed = await bcrypt.hash(password, 10);
        updateData.password = hashed;
    }

    await User.findByIdAndUpdate(req.session.userId, updateData);

    res.redirect('/profile');
});

router.get('/profile', authMiddleware, async (req, res) => {

    const user = await User.findById(req.session.userId);

    // ✅ FIRST get tasks
    const tasks = await Task.find({ assignedTo: user._id });

    // ✅ THEN use tasks
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length
    };

    res.render('profile', { user, stats });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;   