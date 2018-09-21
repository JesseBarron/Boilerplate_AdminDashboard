const mongoose = require("mongoose");
const moment = require("moment");

const CouponSchema = mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    pushDate: {
        type: Date,
        default: moment()
    },
    expDate: Date,
    activationDate: {
        type: Date,
        default: moment()
    },
    numReceived: {
        type: Number,
        default: 0
    },
    numRedeemed: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    thumbnail: String
})

const Coupon = mongoose.model("Coupon", CouponSchema);

module.exports = {
    Coupon
}