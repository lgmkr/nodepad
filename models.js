var mongoose = require('mongoose');

var schema = mongoose.Schema
  , objectId = schema.ObjectId;

function idToHex() {
  return this._id.toHexString();
}

var documents = new schema({
  id    : {type: objectId, get: idToHex}, 
  title  : {type: String},
  tags   : {type: String}
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
