
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes'),
  mongoose = require('mongoose'),
  db = mongoose.connect('mongodb://localhost/nodepad'),
  Document = require('./models.js').Document(db);

var ObjectId = mongoose.Types.ObjectId;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
 // app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.configure('test', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  db = mongoose.connect('mongodb://localhost/nodepad-test');
});

// Routes

app.get('/', routes.index);

app.get('/documents.:format?', function(req, res) {
  Document.find({}, function(err, documents) {
    console.log(documents);
    switch (req.params.format){
      case 'json':
        res.send(documents.map(function(d) {
          return d.__doc;
        }));
      break;
      default:
        //res.render('documents/index.jade');
        //res.redirect('/documents');
        res.render('documents/index.jade', { documents: documents })
    };
  });
});

app.get('/documents/:id.:format?/edit', function(req, res) {
  Document.findOne({'_id': new ObjectId(req.params.id)}, function(err, d) {
    res.render('documents/edit.jade', { d: d });
  });
});

app.get('/documents/new', function(req, res) {
  res.render('documents/new.jade', { d: new Document() });
});

app.post('/documents', function(req, res){
  var d = new Document;
  d.title = req.body.document.title;
  d.tags = req.body.document.tags;
  d.save(function(){
    res.redirect('/documents');
  })

});

app.post('/documents/:id.:format?', function(req, res) {
  Document.findOne({'_id': new ObjectId(req.params.id)}, function(err, d) {
    d.title = req.body.document.title;
    d.data = req.body.document.data;
    d.save(function() {
      // Выдаем результат в запрошенном формате
      switch (req.params.format) {
        case 'json':
          res.send(d.__doc);
         break;

         default:
          res.redirect('/documents');
      }
    });
  });
})

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
