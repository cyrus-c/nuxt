// import { Router } from 'express'
const express  = require('express')

const _uuid = require('node-uuid');
// var uid = uuid.v1();

const app = express()
// 连接数据库
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
// 指定数据库
const dbName = 'local';

// 文件上传模块
const formidable = require('formidable')

// memory-cache
const mcache = require('memory-cache');

// session
const session = require('express-session');
const FileStore = require('session-file-store')(session);

var identityKey = 'skey';



var usersdata = require('./usersdata').items;

var findUser = function(name, password){
    return usersdata.find(function(item){
        return item.name === name && item.password === password;
    });
};

MongoClient.connect(url,function(err,client){

    // 指定表
    const col = client.db(dbName).collection('users');


    // session
    app.use(session({
        name: identityKey,
        secret: 'cc',  // 用来对session id相关的cookie进行签名
        store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
        saveUninitialized: true,  // 是否自动保存未初始化的会话，建议false
        resave: false,  // 是否每次都重新保存会话，建议false
        cookie: {
            maxAge: 60 * 1000  // 有效期，单位是毫秒
        }
    }));

    // islogin
    app.get('/homelist/islogin',function(req,res,next){
        res.send(req.session)
    })

    // login
    app.post('/homelist/login',async function(req,res,next){
        var sess = req.session;
        var user = findUser(req.body.name, req.body.password);
        // console.log(user);
        if(user){
            req.session.regenerate(function(err) {
                if(err){
                    // const responseData = 
                    res.send({
                        code:4000,
                        msg:"Login failed"
                    })
                    return;        
                }
                req.session.loginUser = user.name;
                // const responseData = {
                //     code:200,
                //     msg:"Login successful"
                // }
                // res.send(responseData)
                res.send({
                    code:200,
                    msg:"Login successful"
                })
            });
        }else{
            // const responseData = {
            //     code:4000,
            //     msg:"Incorrect username or password"
            // }
            // res.send(responseData) 
            res.send({
                code:4000,
                msg:"Incorrect username or password"
            })
        }  
    })
    
    // logout
    app.get('/homelist/logout',function(req,res,next){
        req.session.destroy(function(err) {
            if(err){
                // res.json({ret_code: 2, ret_msg: 'Logout failed'});
                // const responseData = {
                //     code:4000,
                //     msg:"Logout failed"
                // }
                // res.send(responseData)
                res.send({code:4000,msg:"Logout failed"})
                return;
            }
            // req.session.loginUser = null;
            res.clearCookie(identityKey);
            res.send({code:200,msg:"Logout successful"})
            // res.redirect('/');
        });
    });


    // search data
    app.get('/homelist/list',function(req,res,next){
        // 将找到的结果按照_id排序，取前10个，通过res.json传到前端
        // res.header('Access-Control-Allow-Origin', '*') //解决跨域问题
        col.find({}).sort({"_id":-1}).limit(10).toArray(function(err,items){
            const responseData = {
                code:200,
                msg:"search successful",
                data:items
            }
            res.send(responseData)
        })
    })

    // insertOne
    app.post('/homelist/add',async function(req,res,next){
        const uid = _uuid.v4();
        const data = {
            userName : req.body.userName,
            uuid:uid
        }
        col.insertOne(data, (err, result) => {
            if(err) throw err
            const responseData = {
                code:200,
                msg:"Inserted successfully"
            }
            res.send(responseData)
        })
    })

    // insertMany
    app.post('/homelist/addMultiple',async function(req,res,next){
        const data = req.body
        // console.log(data);
        for (const item in data) {
            const uid = _uuid.v4();
            data[item] = {
                userName:data[item].userName,
                uuid:uid
            }
        }
        col.insertMany(data, (err, result) => {
            if(err) throw err
            const responseData = {
                code:200,
                msg:"Successfully inserted:"+result.result.n
            }
            res.send(responseData)
        })
    })

    // updateOne
    app.post('/homelist/update',async function(req,res,next){
        const uuid = req.body.uuid
        const newdata = req.body.newData
        col.updateOne({ "uuid": uuid }, { $set: { "userName": newdata}}, (err, result) => {
            if (err) throw err
            const responseData = {
                code:200,
                msg:"update completed"
            }
            res.send(responseData)
        })
    })

    // deleteOne
    app.post('/homelist/delete',async function(req,res,next){
        const uuid = req.body.uuid
        col.deleteOne({ "uuid": uuid }, (err, result) => {
            if (err) throw err
            const responseData = {
                code:200,
                msg:"successfully deleted"
            }
            res.send(responseData)
        })  
    })

    // upload
    app.post('/homelist/upload',async function(req,res,next){
        var form = new formidable.IncomingForm()
        form.uploadDir = "./static/img"
        form.keepExtensions = true
        form.parse(req, function(err, fields, files) {
          if (err) return res.redirect(303, '/error')
          let response = {
            fields,
            files,
            msg: `Uploaded successfully`
          }
          res.send(response)
        })

    })

    


    
})

// export default app
module.exports = app;

