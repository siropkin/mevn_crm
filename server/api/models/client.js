const mongoose = require('mongoose');
require('mongoose-type-email');

const clientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: mongoose.SchemaTypes.Email, allowBlank: true },
    phone: String,    
    providers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }]
});

module.exports = mongoose.model('Client', clientSchema);