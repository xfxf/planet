$(document).ready(function(){
  ajaxPostLoader.init();
  issuesLoader.init();
  tooltipInitializer.init();
  fancyBoxInitializer.init();
});

var fancyBoxInitializer = {

  init: function(){
    $('a').each(function () {
      if ($(this).has('img')) {
        $(this).fancybox();
      }
    });
  }
}

var ajaxPostLoader = {

  init: function(){
    this.initShowMoreClick();
    this.initHideMoreClick();
  },

  initShowMoreClick: function(){
    $('#main .news').on('click', '.show-more', function(){
      var $show_more = $(this),
          $post = $show_more.closest('.post'),
          $hide_more = $post.find('.hide-more'),
          $excerpt = $post.find('.post-excerpt'),
          $content = $post.find('.post-content'),
          json_path = $post.data('json');

      $show_more.addClass('disabled');
      $show_more.text('Loading...');

      if($content.text().length > 0){
        $excerpt.hide();
        $content.show();

        ajaxPostLoader.showHideMoreButton($show_more, $hide_more);
      }
      else{
        $.getJSON(json_path, function(data){
          $excerpt.hide();
          $content.html(data.content);

          ajaxPostLoader.showHideMoreButton($show_more, $hide_more);
        });
      }

    });
  },

  initHideMoreClick: function(){
    $('#main .news').on('click', '.hide-more', function(){
      var $hide_more = $(this),
          $post = $hide_more.closest('.post'),
          $show_more = $post.find('.show-more'),
          $excerpt = $post.find('.post-excerpt'),
          $content = $post.find('.post-content');
      
      $hide_more.addClass('disabled');
      $hide_more.text('Loading...');

      $excerpt.show();
      $content.hide();

      ajaxPostLoader.showShowMoreButton($show_more, $hide_more);
    });
  },

  showHideMoreButton: function($show_more, $hide_more){
    $show_more.removeClass('disabled');
    $show_more.hide();
    $hide_more.show();

    $hide_more.removeClass('disabled');
    $hide_more.text('Hide more...');
  },

  showShowMoreButton: function($show_more, $hide_more){
    $hide_more.removeClass('disabled');
    $hide_more.hide();
    $show_more.show();
    
    $show_more.removeClass('disabled');
    $show_more.text('Show more...');
  }

}


var issuesLoader = {

  init: function(){
    this.initShowMoreClick();
    this.initHideMoreClick();
  },

  initShowMoreClick: function(){
    $('#main .issues').on('click', '.show-more', function(){
      var $show_more = $(this),
          $issue = $show_more.closest('.issue'),
          $hide_more = $issue.find('.hide-more'),
          $content = $issue.find('.issue-content');
          
      $content.show();

      $show_more.hide();
      $hide_more.show();

    });
  },

  initHideMoreClick: function(){
    $('#main .issues').on('click', '.hide-more', function(){
      var $hide_more = $(this),
          $issue = $hide_more.closest('.issue'),
          $show_more = $issue.find('.show-more'),
          $content = $issue.find('.issue-content');
      
      $content.hide();

      $hide_more.hide();
      $show_more.show();
    });
  }
}

var tooltipInitializer = {

  init: function() {
    $('[data-toggle="tooltip"]').tooltip();
  }

}