const Message = require('../../models/Message');
const express = require('express')
const router = express.Router();


router.get('/message', (req, res) => {
    res.render('message')
})

router.post('/message', async (req, res) => {
    let message = await Message({
        title: req.body.title,
        body: req.body.message
    })

    await message.save()
    .then(messageCreated => {
        console.log('Created message: ', messageCreated)
    })
    .catch(err => {"Error ", err})

    res.redirect('/dashboard')
})

module.exports = router