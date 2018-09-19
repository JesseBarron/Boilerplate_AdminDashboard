const mongoose = require("mongoose");

const postalValidator = {
    validator: (val) => {
        return /^[0-9]{5}(-[0-9]{4,5})?$/gm.test(val)
    },
    message: props => `${props.value} is not a valid zip code`
}

const AddressSchema = mongoose.Schema({
    addressType: {
        type: String,
        enum: ["Billing", "NonBilling"]
    },
    addressLine: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        minlength: 2,
        maxlength: 3,
    },
    postal: {
        type: String,
        validate: postalValidator
    }
});


const Address = mongoose.model("Address", AddressSchema);

module.exports = {
    Address
}