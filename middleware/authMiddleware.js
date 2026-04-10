module.exports = (req, res, next) => {
    if (!req.session.userId) {
        return res.send('Please login first');
    }
    next();
};