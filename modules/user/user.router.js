import { Router } from "express";
import * as userController from "./controller/user.js"
const router = Router()
router.get("/",userController.allUsers)
router.put("/updateUser/:id",userController.updateUser)
router.patch("/updatePassword",userController.updatePassword)
router.delete("/deleteUser/:id",userController.deleteUser)
router.get("/searshByName",userController.searshByName)
router.get("/getSpecificAge",userController.getSpecificAge)
router.get("/:id",userController.getUserById)
export default router