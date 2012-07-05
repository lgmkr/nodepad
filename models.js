var mongoose = require('mongoose');

var schema = mongoose.Schema
  , objectId = schema.ObjectId;

var documents = new schema({
  title  :String,
  tags   :String
});
//mongoose.model('Document', {
//    properties: ['title', 'data', 'tags'],
//
//      indexes: [
//            'title'
//              ]
//});

exports.Document = function(db) {
    return db.model('documents', documents);
};
