var express = require( "express" ),
    mongojs = require( "mongojs" ),
    moment = require( "moment" );
    
var app = express.createServer( express.logger() ),
    db_uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "kiitollisuuspurkki",
    db = mongojs.connect( db_uri, [ "thanks" ] );

app.set( "views", __dirname + "/public" );
app.set( "view options", { "layout": false} );
moment.lang( "fi" );

app.use(express.static( __dirname + '/public' ));
app.use( express.bodyParser() );

app.get( "/", function(req, res) {
  res.render( "index.jade" );
});

app.post( "/create", function( req, res ){
  if ( !req.body.thankyou ) {
    res.send(400);
  }

  db.thanks.save({
      "thankyou": req.body.thankyou
    , "date": new Date()
  }, function( err ){
    if ( err ){
      res.send(500);
    }

    res.send(200);
  });
});

app.get( "/view", function( req, res ){
  
  if ( (new Date()).getYear() < 2014 ) {
    res.render( "thanks.jade", { "thanks": [{
        "thankyou": "<h1>Ei vielä! :)</h1>"
      , "date": "Vasta " + moment().endOf( "year" ).fromNow()
    }]});
  }
  
  db.thanks.find().sort({ date: 1 }, function( err, thanks ){
    res.render( "wishes.jade", { "thanks": thanks } );
  });
});

var port = process.env.PORT || 8000;
app.listen( port, function() {
  console.log( "Listening on " + port );
});