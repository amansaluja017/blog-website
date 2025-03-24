import express from 'express';
import { userRegister } from '../controller/user.controller';

const router = express.Router();

router.route('/register').post(userRegister);


export default router;