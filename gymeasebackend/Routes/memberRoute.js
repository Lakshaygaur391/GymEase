const express = require('express');
const router = express.Router();
const memberCont = require('../Controllers/memberCont');
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/add', authMiddleware, memberCont.addMember);
router.get('/all', authMiddleware, memberCont.getMembers);
router.get('/details/:id', authMiddleware, memberCont.getMemberById);
router.put('/status/:id', authMiddleware, memberCont.updateMemberStatus);
router.put('/renew/:id', authMiddleware, memberCont.renewMembership);
router.get('/specific/:category', authMiddleware, memberCont.getSpecificMembers);
router.get('/stats', authMiddleware, memberCont.getDashboardStats);

module.exports = router;
