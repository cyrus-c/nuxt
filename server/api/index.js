// import { Router } from 'express'
const { Router } = require('express')

const homelist = require('./homelist')

// import homelist from './homelist'

const router = Router()

router.use(homelist)

// export default router
module.exports = router;