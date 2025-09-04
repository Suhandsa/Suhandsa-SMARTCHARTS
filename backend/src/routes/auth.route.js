import express from 'express';

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send('Hello signup');
});

router.get('/login', (req, res) => {
    res.send('Hello login');
});

router.get('/logout', (req, res) => {
    res.send('Hello logout');
});

export default router;