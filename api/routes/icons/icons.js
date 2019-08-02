var express = require('express');
var router = express.Router();
var Mongo = require("mongodb-curd");

var databaseName = "test";
var coll_icon = "icons";

//查找当前已有的icon图标
var getIcons = function(req, res, next) {
    // const { uid } = req.body;
    var page = req.body.page;
    var pageSize = req.body.pageSize;
    Mongo.find(databaseName, coll_icon, function(result) {
        if (!result) {
            res.send({ code: 1, msg: "查找失败" })
        } else {
            res.send({ code: 2, data: result })
        }

    })
};

//添加icon图标
var addIcons = function(req, res, next) {
    const { icon } = req.body;
    Mongo.insert(databaseName, coll_icon, { "icon": icon }, function(result) {
        if (!result) {
            res.send({ code: 1, msg: "添加失败" })
        } else {
            res.send({ code: 2, msg: "添加成功" })
        }

    })
};

//删除icon图标
var deleteIcons = function(req, res, next) {
    const { id } = req.body;
    Mongo.remove(databaseName, coll_icon, { "_id": id }, function(result) {
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
    getIcons,
    addIcons,
    deleteIcons
};