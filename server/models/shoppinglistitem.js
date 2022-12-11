const mongoose = require('mongoose')
const Item = mongoose.Schema(
    {
        itemName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            default: '',
        },
        isSelected: {
            type: Boolean,
            default: ''
        },
    },
    { timestamps: true }
)


module.exports = mongoose.model('Item', Item)