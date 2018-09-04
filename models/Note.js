var mongoose = require("mongoose");

var NoteSchema = mongoose.Schema({

    created: Date,
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    note: String,
    notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
    isRoot: Boolean

})

const autoPopulateChildren = function(next) {
    this.populate('notes').sort({created:-1});
    next();
};

NoteSchema
    .pre('findOne', autoPopulateChildren)
    .pre('find', autoPopulateChildren)

var Note = mongoose.model('Note', NoteSchema);

module.exports = {
    Note
}