function add_to_page( idea_body, idea_title, date) {
  if ( !window.jade ){
    throw "No client-side templates"
  }

  if ( !window.markdown ){
    throw "no markup-js for client side"
  }

  var template = jade.templates[ "idea" ]({
    "idea" : {
        "body": markdown.toHTML( idea_body )
      , "title": idea_title
      , "date": date
    }
  });

  $( "#game-ideas" ).prepend( template );
}

$(document).ready(function(){

  $("#submit").click(function(){
    var $this = $( this )
        idea = $("#idea").val()
        title = $("#idea-title").val();

    if ( idea === "" || title === "" ){
      $this.addClass( "btn-danger" ).val( "Empty :|" );
      return;
    }

    jQuery.post("/create", {
        "idea": idea
      , "title": title
    }, function(){
      $this.addClass( "btn-success" ).val( "Saved :)" );
      add_to_page(idea, title, new Date())
    }).fail(function(){
      $this.addClass( "btn-danger" ).val( "Failed D:" );
    });

  });

  $( document ).on( "click", ".idea-title", function(){
    $( this ).next().slideToggle( {"easing": "linear"} );
  });

  $( "#markdown-reference-link > a" ).click(function( ev ){
    ev.preventDefault();
    $( "#markdown-reference" ).fadeIn( 400, function(){
      $(this).animate({
        "width": "20em"
      });
    });
  });

  $( "#hide-reference" ).click(function( ev ){
    ev.preventDefault();
    var $el = $( this ).parent();
    $el.animate({
        "width": "-10px"
      }, {
        "complete": function(){
          $el.fadeOut();
        }
    });
  });
});