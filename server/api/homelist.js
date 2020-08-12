// import { Router } from 'express'
const { Router } = require('express')

const _uuid = require('node-uuid');
// var uid = uuid.v1();

const router = Router()
// 连接数据库
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
// 指定数据库
const dbName = 'local';

MongoClient.connect(url,function(err,client){
    // 指定表
    const col = client.db(dbName).collection('users');

    // 查询数据
    router.get('/homelist',function(req,res,next){
        // 将找到的结果按照_id排序，取前10个，通过res.json传到前端
        col.find({}).sort({"_id":-1}).limit(10).toArray(function(err,items){
            res.json(items)
        })
    })

    // 插一条数据
    router.post('/homelist/add',async function(req,res,next){
        const uid = _uuid.v4();
        const data = {
            userName : req.body.userName,
            uuid:uid
        }
        col.insertOne(data, (err, result) => {
            if(err) throw err
            const responseData = {
                code:200,
                msg:"插入成功"
            }
            res.send(responseData)
        })
    })

    // 插多条数据
    router.post('/homelist/addMultiple',async function(req,res,next){
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
            console.log();
            const responseData = {
                code:200,
                msg:"成功插入"+result.result.n+"条"
            }
            res.send(responseData)
        })
    })

    // 更新一条数据
    router.post('/homelist/update',async function(req,res,next){
        const uuid = req.body.uuid
        const newdata = req.body.newData
        col.updateOne({ "uuid": uuid }, { $set: { "userName": newdata}}, (err, result) => {
            if (err) throw err
            const responseData = {
                code:200,
                msg:"更新成功"
            }
            res.send(responseData)
        })
    })

    // 删除一条数据
    router.post('/homelist/delete',async function(req,res,next){
        const uuid = req.body.uuid
        col.deleteOne({ "uuid": uuid }, (err, result) => {
            if (err) throw err
            const responseData = {
                code:200,
                msg:"删除成功"
            }
            res.send(responseData)
        })
    })

    


    
})

// export default router
module.exports = router;

