var express = require('express');
var router = express.Router();
var Mongo = require("mongodb-curd");

var databaseName = "test";
var coll_class = "class";

//获取当前已有的用户分类
var getClass = function(req, res, next) {
    const { uid, income } = req.body;
    if (income == "收入") {
        Mongo.find(databaseName, coll_class, { "uid": uid, "income": income }, function(result) {
            if (result.length === 0) {
                res.send({ code: 1, msg: "获取分类失败!" })
            } else {
                res.send({ code: 2, data: result })
            }
        })
    } else if (income == "支出") {
        Mongo.find(databaseName, coll_class, { "uid": uid, "income": income }, function(result) {
            if (result.length === 0) {
                res.send({ code: 1, msg: "获取分类失败!" })
            } else {
                res.send({ code: 2, data: result })
            }
        })
    }

};

//添加分类
var addClass = function(req, res, next) {
    const { uid, icon, style, income } = req.body;
    Mongo.insert(databaseName, coll_class, { "uid": uid, "icon": icon, "style": style, "income": income }, function(result) {
        if (!result) {
            res.send({ code: 1, msg: "添加失败" })
        } else {
            res.send({ code: 2, data: result, msg: "添加成功" })
        }

    })
};

//删除分类
var deleteClass = function(req, res, next) {
    const { id } = req.body;
    Mongo.remove(databaseName, coll_class, { "_id": id }, function(result) {
        if (!id) {
            res.send({ code: 3, msg: "参数为空！" })
        } else {
            if (result.deletedCount === 0) {
                res.send({ code: 1, msg: "删除失败" })
            } else {
                res.send({ code: 2, msg: "删除成功" })
            }
        }
    })
};

module.exports = {
    getClass,
    addClass,
    deleteClass
};