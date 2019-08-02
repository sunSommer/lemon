var express = require('express');
var router = express.Router();
var Mongo = require("mongodb-curd");
var bill = require("./bill/bill");
var classes = require("./class/classes");
var icons = require("./icons/icons");

var databaseName = "test";
var coll_user = "user";
var coll_bill = "bill";
var coll_class = "class";
var coll_icon = "icons";

/* GET home page. */

//登录页面
router.post('/api/login', function(req, res, next) {
    const { name, pwd } = req.body;
    Mongo.find(databaseName, coll_user, { "name": name, "pwd": pwd }, function(result) {

        if (result.length == 0) {
            res.json({ code: 1, msg: "该用户不存在,请先注册账号" })
        } else {
            res.send({ code: 2, msg: "登陆成功", data: result[0]._id })
        }

    })
});

//注册页面
router.post('/api/register', function(req, res, next) {
    const { name, pwd } = req.body;
    Mongo.insert(databaseName, coll_user, { "name": name, "pwd": pwd }, function(result) {

        if (result.length == 0) {
            res.json({ code: 1, msg: "注册失败" })
        } else {
            res.send({ code: 2, msg: "注册成功" })
        }

    })
});

//查找用户
router.post('/api/getUser', function(req, res, next) {
    const { name, pwd } = req.body;
    Mongo.find(databaseName, coll_user, { "name": name, "pwd": pwd }, function(result) {
        if (!name || !pwd) {
            res.send({ code: 3, msg: "参数为空！" })
        } else {
            if (result.length === 0) {
                res.send({ code: 1, msg: "查无此人!" })
            } else {
                res.send({ code: 2, data: result })
            }
        }
    })
});

//首页查找账单,上拉加载
router.post('/api/getBill', bill.getBill);

//根据日历的时间查找账单
router.post('/api/getDateBill', bill.getDateBill);

//添加账单
router.post('/api/addBill', bill.addBill);

//删除账单
router.post('/api/deleteBill', bill.deleteBill);

//修改账单
router.post('/api/updateBill', bill.updateBill);

//获取当前已有的用户分类
router.post('/api/getClass', classes.getClass);

//添加分类
router.post('/api/addClass', classes.addClass);

//删除分类
router.post('/api/deleteClass', classes.deleteClass);

//查找当前已有的icon图标
router.post('/api/getIcons', icons.getIcons);

//添加icon图标
router.post('/api/addIcons', icons.addIcons);

//删除icon图标
router.post('/api/deleteIcons', icons.deleteIcons);

module.exports = router;