var express = require( "express" ),
    mongojs = require( "mongojs" ),
    moment = require( "moment" ),
    markdown = require( "markdown" ).markdown,
    SendGrid = require( "sendgrid" ).SendGrid;


var app = express.createServer( express.logger() ),
    db_uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "gameideas",
    db = mongojs.connect( db_uri, [ "ideas" ] ),
    sendgrid = new SendGrid( process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD ),
    send_email = !!process.env.PRODUCTION,
    email_recepients = [
        "tatu.kairi@gmail.com"
      , "eerovolaine@yahoo.com"
      , "atte.vieno@googlemail.com"
      , "jesse.laanti@gmail.com"
    ];

app.set( "views", __dirname + "/public" );
app.set( "view options", { "layout": false} );

app.use(express.static( __dirname + '/public' ));
app.use( express.bodyParser() );

app.get( "/", function(req, res) {
  db.ideas.find().sort({ date: -1 }, function( err, collection ){
    if ( !err ) {

      ideas = collection.map(function( idea ){
        return {
            "body": markdown.toHTML( idea.body )
          , "title": idea.title
          , "date": idea.date
          , "original_body" : idea.body
          , "id": idea._id
        };
      });
      res.render( "index.jade", { "ideas": ideas } );
    }
  });
});

function _valid( req ) {
  return ( req.body.idea && req.body.title );
}

app.post( "/create", function( req, res ){
  if ( !_valid(req) ){
    res.send(400);
  }

  db.ideas.save({
      "body": req.body.idea
    , "title": req.body.title
    , "date": new Date()
  }, function( err, idea ){
    if ( err ){
      res.send(500);
    }

    res.send(idea._id);

    if ( send_email ){
      sendgrid.send({
        to: email_recepients,
        from: 'gameideas@gameideas.herokuapp.com',
        subject: "Created: " + req.body.title,
        text: "Hi!\n\nSomebody created game idea titled: " + req.body.title + "\n\nVisit http://gameideas.herokuapp.com to check it out!"
      });
    }
  });

});

app.post( "/update", function( req, res ){
  if ( !_valid(req) ){
    res.send(400);
  }

  if ( !req.body.id ){
    res.send(400);
  }
  db.ideas.update({"_id": db.ObjectId(req.body.id)}, { $set: {
      "body": req.body.idea
    , "title": req.body.title
  }}, function( err, foo ){
    if ( err ){
      res.send(400);
    }
    res.send(200);

    if ( send_email ){
      sendgrid.send({
        to: email_recepients,
        from: 'gameideas@gameideas.herokuapp.com',
        subject: "Updated: " + req.body.title,
        text: "Hi!\n\nSomebody updated game idea titled: " + req.body.title + "\n\nVisit http://gameideas.herokuapp.com to check it out!"
      });
    }
  });
});

var port = process.env.PORT || 8000;
app.listen( port, function() {
  console.log( "Listening on " + port );
});