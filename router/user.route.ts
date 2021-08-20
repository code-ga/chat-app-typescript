import express from "express"
import { LoginUser, registerUser } from "../controllers/user.controllers"
import { validationUser } from '../middleware/validationUserForm';
import { validationUserLogin } from '../middleware/validationUserLogin';
import { checkUserLogin } from '../controllers/user.controllers';
import { verifyToken } from "../middleware/validation";

const route = express.Router()

route.post("/register", validationUser, registerUser);
route.post("/login", validationUserLogin, LoginUser)
route.get("/",verifyToken , checkUserLogin)

export default route