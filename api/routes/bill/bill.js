var express = require('express');
var router = express.Router();
var Mongo = require("mongodb-curd");

var databaseName = "test";
var coll_bill = "bill";

//首页查找账单,上拉加载
var getBill = function(req, res, next) {
    let { uid, page, pageSize } = req.body;
    Mongo.find(databaseName, coll_bill, { "uid": uid }, function(result) {
        if (!uid) {
            res.send({ code: 3, msg: "参数为空！" })
        } else {
            if (result.length === 0) {
                res.send({ code: 1, msg: "无账单!" })
            } else {
                res.send({ code: 2, data: result })
            }
        }
    }, {
        skip: (page - 1) * pageSize,
        limit: pageSize
    })
};

//根据日历的时间查找账单
var getDateBill = function(req, res, next) {
    let { uid, page, pageSize } = req.body;
    let timer = new RegExp(req.body.timer);
    Mongo.find(databaseName, coll_bill, { "uid": uid, "timer": timer }, function(result) {
        if (!uid) {
            res.send({ code: 3, msg: "参数为空！" })
        } else {
            if (result.length === 0) {
                res.send({ code: 1, msg: "无账单!" })
            } else {
                res.send({ code: 2, data: result })
            }
        }
    }, {
        sort: {
            "_id": 1
        }
    })
};

// , {
//     skip: (page - 1) * pageSize,
//     limit: pageSize
// }

//添加账单
var addBill = function(req, res, next) {
    // const { uid, icon, style, income, timer, price } = req.body;
    const obj = req.body;
    var price = req.body.price;
    Mongo.insert(databaseName, coll_bill, obj, function(result) {
        if (!result) {
            res.send({ code: 1, msg: "添加失败" })
        } else {
            res.send({ code: 2, msg: "添加成功" })
        }

    })
};

//删除账单
var deleteBill = function(req, res, next) {
    const { id } = req.body;
    Mongo.remove(databaseName, coll_bill, { "_id": id }, function(result) {
        // console.log(result)
        if (!id) {
            res.send({ code: 3, msg: "参数为空！" })
        } else {
            if (result.deletedCount == 0) {
                res.send({ code: 1, msg: "删除失败" })
            } else {
                res.send({ code: 2, msg: "删除成功" })
            }
        }
    })
};

//修改账单
var updateBill = function(req, res, next) {
    console.log(req.body.id)
        // let { obj } = req.body;
    let id = req.body.id;
    let obj = req.body;
    delete obj.id;
    Mongo.update(databaseName, coll_bill, [{ "_id": id }, obj], function(result) {
        console.log(result)
        if (!id) {
            res.send({ code: 3, msg: "参数为空！" })
        } else {
            if (!result) {
                res.send({ code: 1, msg: "修改失败" })
            } else {
                res.send({ code: 2, msg: "修改成功" })
            }
        }
    })
};

module.exports = {
    getBill,
    getDateBill,
    addBill,
    deleteBill,
    updateBill
};