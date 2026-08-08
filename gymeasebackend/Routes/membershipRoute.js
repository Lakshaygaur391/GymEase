const express = require('express');
const router = express.Router();
const membershipCont = require('../Controllers/membershipCont');
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/add', authMiddleware, membershipCont.addMembership);
router.get('/all', authMiddleware, membershipCont.getMemberships);

module.exports = router;
