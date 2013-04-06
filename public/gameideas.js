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
    }).fail(function(){
      $this.addClass( "btn-danger" ).val( "Failed D:" );
    });

  });
  
  $( ".idea-title" ).click(function(){
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