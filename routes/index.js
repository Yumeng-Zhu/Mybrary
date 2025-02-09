//routes = controller in MVX
const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    // res.send('Hi ya')
    res.render('index')
})

module.exports = router