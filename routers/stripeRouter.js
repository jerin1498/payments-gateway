const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')

// frontEnd rendering
router.get('/', (req, res, next) => {
    return res.status(200).render('index.html')
})

router.get('/session', (req, res, next) => {
    return res.status(200).render('sessionPayment.html')
})


// account related 
router.post('/createAccount', accountController.createAccount)
router.post('/updateAccount', accountController.updateAccount)
router.post('/retrieveAccount', accountController.retrieveAccount)

// creating payments
router.post('/createPayment', accountController.createPayment) // using create method
router.get('/cerateSessions', accountController.createSessions) // using sessions


module.exports = router