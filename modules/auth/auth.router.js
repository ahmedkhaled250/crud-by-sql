import { Router } from "express";
import * as authController from "./controller/auth.js"
const router = Router()
router.post("/signup",authController.signUp)
router.post("/login",authController.login)
router.post("/logout/:id",authController.logout)
export default router