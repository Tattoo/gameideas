function idea_html( body, title, date, original ) {
  return jade.templates[ "idea" ]({
    "idea" : {
        "body": markdown.toHTML( body )
      , "title": title
      , "date": date
      , "original_body": original
    }
  });
}

function add_to_page( idea_body, idea_title, date) {
  if ( !window.jade ){
    throw "No client-side templates"
  }

  if ( !window.markdown ){
    throw "no markup-js for client side"
  }

  $( "#game-ideas" ).prepend( idea_html(idea_body, idea_title, date, idea_body) );
}

function edit_idea( target ){
  var $target = $( target ),
      $title_element = $target.find( ".idea-title" ),
      title = $title_element.text(),
      $body_element = $target.find( ".idea-body" ),
      body = $target.find( ".idea-original" ).val();

      $body_element.after( '<input type="hidden" value="' + title + '" class="edit-original-title" />' )
                   .after( '<br /><button class="edit-button btn btn-mini">Save</button><button class="cancel-button btn btn-mini">Cancel</button>' );

      $title_element.replaceWith( '<input type="text" class="edit-title" value="' + title + '" />' );
      $body_element.replaceWith( '<textarea class="edit-body">' + body + '</textarea>' );
}

function idea_title_toggle( ev ) {
  ev.preventDefault();
  $( this ).next().slideToggle( {"easing": "linear"} );
}

function edit_idea_link( ev ) {
  ev.preventDefault();
  $( this ).hide();
  edit_idea( $(this).parent().parent() );
}

function cancel_edit_button() {
  var $target = $( this ).parent().parent(),
      title = $target.find( ".edit-original-title" ).val(),
      body = original = $target.find( ".idea-original" ).val(),
      date = $target.find( ".time" ).text();

  $target.slideUp(function(){
    $target.html( idea_html(body, title, date, original) );

    $target.slideDown(function(){
      $target.find(".well").slideDown();
    });
  });
}

$(document).ready(function(){

  $("#submit").click(function(){
    var $this = $( this ),
        idea = $("#idea").val(),
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

  $( document ).on( "click", ".idea-title", idea_title_toggle)
               .on( "click", ".idea-edit-link", edit_idea_link)
               .on( "click", ".cancel-button", cancel_edit_button);

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