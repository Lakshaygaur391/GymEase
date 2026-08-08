const  express = require('express');
const router = express.Router();
const gym_controllers = require('../Controllers/gymcont');

const authMiddleware = require('../Middleware/authMiddleware');

//register route for gym
router.post("/register",gym_controllers.register);

//login route for gym
router.post("/login",gym_controllers.login);

router.get("/me", authMiddleware, gym_controllers.getGymProfile);
router.post("/logout", gym_controllers.logout);

router.post("/reset-password/sendotp", gym_controllers.sendotp);

router.post("/reset-password/verifyotp", gym_controllers.verifyotp);
router.post("/reset-password/newpassword", gym_controllers.resetpassword);
module.exports = router;