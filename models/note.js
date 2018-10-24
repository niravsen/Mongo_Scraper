var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = mongoose.Schema({
title: {
    String
},
body: {
    String
},
article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
 }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note; 
