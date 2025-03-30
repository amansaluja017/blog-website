"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.route('/register').post(user_controller_1.userRegister);
router.route('/googleLogin').post(user_controller_1.googleUser);
router.route('/getCurrentUser').get(auth_middleware_1.verifyJWT, user_controller_1.getCurrentUser);
router.route('/logout').post(auth_middleware_1.verifyJWT, user_controller_1.logout);
router.route('/login').post(user_controller_1.login);
router.route('/update-details').patch(auth_middleware_1.verifyJWT, user_controller_1.updateDetails);
router.route('/update-password').patch(auth_middleware_1.verifyJWT, user_controller_1.updatePassword);
router.route('/set-password').patch(auth_middleware_1.verifyJWT, user_controller_1.setPassword);
exports.default = router;
