const mongoose = require('mongoose');
require('mongoose-type-email');
const uniqueValidator = require('mongoose-unique-validator');

// TODO: Catch if there is equals providerId
const clientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { 
        type: String, 
        required: [true, 'Client name required'], 
        trim: true,
        unique: true
    },
    email: { 
        type: mongoose.SchemaTypes.Email, 
        allowBlank: true 
    },
    phone: {
        type: String,
        validate: {
            validator: (v) => {
                if (v) { return /\d{10}/.test(v); }
                return true;
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    providers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Provider'
    }]
});

clientSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Client', clientSchema);