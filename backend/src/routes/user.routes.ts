import express, { Router } from 'express';
import { getCurrentUser, googleUser, login, logout, updateDetails, updatePassword, userRegister } from '../controller/user.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.route('/register').post(userRegister);
router.route('/googleLogin').post(googleUser);
router.route('/getCurrentUser').get(verifyJWT, getCurrentUser)
router.route('/logout').post(verifyJWT, logout);
router.route('/login').post(verifyJWT, login);
router.route('/update-details').patch(verifyJWT, updateDetails);
router.route('/update-password').patch(verifyJWT, updatePassword);


export default router;