import { Router } from "express";
import * as productController from "./controller/product.js"
const router = Router()
router.post('/',productController.addProdect)
router.put('/:id',productController.updateProduct)
router.delete('/:id',productController.deleteProduct)
router.get('/getProductsWithSpecificPrice',productController.getProductsWithSpecificPrice)
router.get("/",productController.products)
router.get('/:id',productController.getProductById)
export default router