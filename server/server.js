const express = require('express')
const mongoose = require('mongoose')
const Item = require('./models/shoppinglistitem.js')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

//connect database
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/shopping_list_dev', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connect successfully!')
    } catch (error) {
        console.log("Connect failed!")
    }

}
//get
app.get("/api", (req, res) => {
    Item.find({}, function (err, item) {
        if (!err) {
            res.json(item);
        }
        else res.status(400).json({ error: 'ERROR!!' })
    })
})

//post
app.post('/api', async (req, res) => {
    try {
        Item.create({
            itemName: req.body.itemName,
            quantity: req.body.quantity,
            isSelected: req.body.isSelected
        })
        res.status(200).json({
            success: true,
            message: "add success"
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "add fail"
        });
        // res.json(err);
    }
})

connect()

// app.use('/api', )
app.listen(port, () => {
    console.log(`Server start on port: ${port}`)
})