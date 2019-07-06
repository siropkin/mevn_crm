const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const providerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { 
        type: String, 
        required: [true, 'Provider name required.'],
        unique: true, 
        trim: true 
    }
});

providerSchema.plugin(uniqueValidator, { message: 'Provider with this name already exists.' });

module.exports = mongoose.model('Provider', providerSchema);