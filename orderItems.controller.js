import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OrderItems } from "../models/orderItems.model.js";



export const createOrderItemsControler=asyncHandler(async(req,res)=>{

    const {orderId,productId,quantity,price,totalPrice}=req.body;
    if(!orderId || !productId || !quantity || !price || !totalPrice){
        throw new ApiError(400,"please provide all required fields for creating a order item")
    }
  

    const orderItem=await OrderItems.create({
        orderId,
        productId,
        quantity,
        price,
        totalPrice
    })


    if(!orderItem){
        throw new ApiError(400,"order item not created")
    }


    return res.status(200).json(new ApiResponse(200,orderItem,"order item created successfully"))
})


export const getRecentOrdersController=asyncHandler(async(req,res)=>{

    const page=parseInt(req.query.page)|| 1;
    const limit=req.query.limit||5;
    const skip=(page -1)*limit;

    const orders=await OrderItems.find({}).skip(skip).limit(limit).populate("Orders").sort({createdAt:-1})

    if(!orders){
        throw new ApiError(400,"No orders found ")
    }

    return res.status(200).json(new ApiResponse(200,{orders,totalPages},"users fetched successfully"))
})
