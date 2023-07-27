import express from "express"
import userRouter from "./modules/user/user.router.js"
import productRouter from "./modules/product/product.router.js"
import authRouter from "./modules/auth/auth.router.js"
const app = express()
app.use(express.json())
app.use("/auth",authRouter)
app.use("/user",userRouter)
app.use("/product",productRouter)
app.use('*',(req,res)=>{
    return res.status(404).json({message:"Not found page"})
})
app.listen(5000,()=>console.log("running............."))