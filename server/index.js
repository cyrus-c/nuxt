const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const api = require('./api')

const app = express()

// 主要解决后端识别不了前端传过来的参数问题，通过引入这个插件将前端参数
// 转成能识别的格式，前端传回json格式的，这就用.sjon。
// 前端用qs.stringify(url格式)传过来就用urlencoded
// 配置好后cmd，mongod -- dbpath d:\data\db 启动数据库服务器
const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use('/api',api)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
