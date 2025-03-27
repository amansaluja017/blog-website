import express, { Router } from 'express';
import { getCurrentUser, googleUser, logout, userRegister } from '../controller/user.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.route('/register').post(userRegister);
router.route('/googleLogin').post(googleUser);
router.route('/getCurrentUser').get(verifyJWT, getCurrentUser)
router.route('/logout').post(verifyJWT, logout);


export default router;