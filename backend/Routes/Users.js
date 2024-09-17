const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Search Users
router.get('/search', authMiddleware, async (req, res) => {
    const { username } = req.query;
    try {
        const users = await User.find({ username: new RegExp(username, 'i') });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error searching users' });
    }
});

// Add Friend
router.post('/add-friend', authMiddleware, async (req, res) => {
    const { friendId } = req.body;
    try {
        const user = await User.findById(req.user);
        const friend = await User.findById(friendId);
        if (!user || !friend) return res.status(404).json({ error: 'User not found' });

        if (user.friends.includes(friendId)) return res.status(400).json({ error: 'Already friends' });

        user.friends.push(friendId);
        friend.friends.push(user._id);

        await user.save();
        await friend.save();

        res.json({ message: 'Friend added' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding friend' });
    }
});

module.exports = router;
