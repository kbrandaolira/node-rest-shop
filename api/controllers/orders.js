const Order = require("../models/order")
const Product = require("../models/product")
const mongoose = require("mongoose");

exports.orders_get_all = (req,res,next) => {
    Order.find()
    .select("_id quantity product")
    .populate("product", "_id name price")
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs
        });
    })
    .catch(err =>{
        res.status(500).json(err);
    });
}

exports.order_create = (req,res,next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result =>{
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json(err);
        })
}

exports.order_by_id = (req,res,next) => {
    Order.findById(req.params.orderId)
    .select("_id quantity product")
    .populate("product", "_id name price")
    .exec()
    .then(doc =>{
        if(doc){
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: "No valid entry found for provided ID"
            });
        }
    })
    .catch(err =>{
        res.status(500).json(err);
    });
}

exports.order_delete = (req,res,next) => {
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}