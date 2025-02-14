import {Router } from "express";
import { createOrderItemsControler, getRecentOrdersController } from "../controllers/orderItems.controller.js";


const router=Router();


router.route("/get-recent-orders").get(getRecentOrdersController)
router.route("/create-order-items").post(createOrderItemsControler)

export default router;



