function idea_html( id, body, title, date, original ) {
  return jade.templates[ "idea" ]({
    "idea" : {
        "body": markdown.toHTML( body )
      , "title": title
      , "date": date
      , "original_body": original
      , "id" : id
    }
  });
}

function add_to_page( id, idea_body, idea_title, date) {
  if ( !window.jade ){
    throw "No client-side templates"
  }

  if ( !window.markdown ){
    throw "no markup-js for client side"
  }

  $( "#game-ideas" ).prepend( idea_html(id, idea_body, idea_title, date, idea_body) );
}

function edit_idea( target ){
  var $target = $( target ),
      $title_element = $target.find( ".idea-title" ),
      title = $title_element.text(),
      $body_element = $target.find( ".idea-body" ),
      body = $target.find( ".idea-original" ).val();

      $body_element.after( '<input type="hidden" value="' + title + '" class="edit-original-title" />' )
                   .after( '<br /><button class="update-button btn btn-mini">Save</button><button class="cancel-button btn btn-mini">Cancel</button>' );

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

function refresh_idea( target_element, content ) {
  var $target = $( target_element );

  $target.slideUp(function(){
    $target.html( content );

    $target.slideDown(function(){
      $target.find(".well").slideDown();
    });
  });
}

function cancel_edit_button() {
  var $target = $( this ).parent().parent(),
      title = $target.find( ".edit-original-title" ).val(),
      body = original = $target.find( ".idea-original" ).val(),
      date = $target.find( ".time" ).text()
      id = $target.find( ".idea-id" ).val();

  refresh_idea( $target, idea_html(id, body, title, date, original) );
}

function update_button() {
  var $target = $( this ).parent().parent(),
      title = $target.find( ".edit-title" ).val(),
      body = $target.find( ".edit-body" ).val(),
      id = $target.find( ".idea-id" ).val();

  post_idea("/update", body, title, id );
}

function post_idea(url, idea, title, id) {
  var is_update = !!id,
      data = is_update ? { "id": id } : {};

  if ( idea === "" || title === "" ){
    fail( "Empty :|" )
    return;
  }

  data.idea = idea;
  data.title = title;

  jQuery.post( url, data, function(){
    if ( is_update ){

      var $target = $( ".idea-id[value='" + id + "']" ).parent().parent(),
          date = $target.find( ".time" ).text();

      refresh_idea( $target, idea_html(id, idea, title, date, idea) );

    } else {
      add_to_page(id, idea, title, new Date());
      $( "#idea, #idea-title" ).val( "" );
    }
    success( "Saved :)" );
  }).fail(function(){
    fail("Failed D:");
  });
}

function status_animation( color ) {
  $( "#background" ).css({
      "background-color": color
    , "opacity" : 1
  }).animate({
    "opacity": 0
  });
}

function success( msg ) {
  $( "#submit" ).removeClass( "btn-danger loading disabled" ).addClass( "btn-success" ).val( msg );
  status_animation( "#51a351" );
}

function fail( msg ) {
  $( "#submit" ).removeClass( "btn-success loading disabled" ).addClass( "btn-danger" ).val( msg );
  status_animation( "#bd362f" );
}

$(document).ready(function(){

  $( "#background" ).height( $(document).height() );

  $("#submit").click(function(){
    var $this = $( this ),
        idea = $("#idea").val(),
        title = $("#idea-title").val();
    $this.addClass( "loading disabled" );
    post_idea("/create", idea, title);
  });

  $( document ).on( "click", ".idea-title", idea_title_toggle )
               .on( "click", ".idea-edit-link", edit_idea_link )
               .on( "click", ".cancel-button", cancel_edit_button )
               .on( "click", ".update-button", update_button );

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