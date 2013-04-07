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

function edit_idea( target ){
  var $target = $( target ),
      $title_element = $target.find( ".idea-title" ),
      title = $title_element.text(),
      $body_element = $target.find( ".idea-body" ),
      body = $target.find( ".idea-original" ).val();

      $( '<br /><button class="edit-button btn btn-mini">Save</button><button class="cancel-button btn btn-mini">Cancel</button>' ).insertAfter( $body_element );
      $title_element.replaceWith( '<input type="text" class="edit-title" value="' + title + '" />' );
      $body_element.replaceWith( '<textarea class="edit-body">' + body + '</textarea>' );
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
      add_to_page(idea, title, new Date());
      $( "#idea, #idea-title" ).val( "" );

    }).fail(function(){
      $this.addClass( "btn-danger" ).val( "Failed D:" );
    });

  });

  $( document ).on( "click", ".idea-title", function( ev ){
    ev.preventDefault();
    $( this ).next().slideToggle( {"easing": "linear"} );
  }).on( "click", ".idea-edit-link", function( ev ){
    ev.preventDefault();
    edit_idea( $(this).parent().parent() );
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