(function ($) {
  $(function () {

    // Navbar
    $(".button-collapse").sideNav();
    $('.parallax').parallax();
    var categories = $('nav .categories-container');
    if (categories.length) {
      categories.pushpin({top: categories.offset().top});
      var $links = categories.find('li');
      $links.each(function () {
        var $link = $(this);
        $link.on('click', function () {
          $links.removeClass('active');
          $link.addClass('active');
          var hash = $link.find('a').first()[0].hash.substr(1);
          var $galleryItems = $('.gallery .gallery-item');

          $galleryItems.stop().addClass('gallery-filter').fadeIn(100);

          if (hash !== 'all') {
            var $galleryFilteredOut = $galleryItems.not('.' + hash).not('.all');
            $galleryFilteredOut.removeClass('gallery-filter').hide();
          }

          // transition layout
          $masonry.masonry({
            transitionDuration: '.3s'
          });
          // only animate on layout
          $masonry.one('layoutComplete', function (event, items) {
            $masonry.masonry({
              transitionDuration: 0
            });
          });
          setTimeout(function () {

            $masonry.masonry('layout');
          }, 1000);
        });
      });
    }


    // Home
    $('.carousel:not(.carousel-slider)').carousel({
      dist: 0,
      padding: 10
    });
    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
      indicators: true,
      onCycleTo: function (el) {
        $('.nav-background img').removeClass('active');
        $('.nav-background img').eq(el.index()).addClass('active');
      }
    });



    // Contact Form Icon
    $("form .form-controls").focus(function () {
      $(this).siblings("label").first().children("i").first().css({"color": "#aaa", "left": 0});
    });
    $("form .form-controls").blur(function () {
      $(this).siblings("label").first().children("i").first().css({"color": "transparent", "left": "-20px"});
    });


    var onShow = function (el) {
      var carousel = el.find('.carousel.initialized');
      carousel.carousel({
        dist: 0,
        padding: 10
      });
    };
    $('.gallery-expand').galleryExpand({
      onShow: onShow
    });

    $('.blog .gallery-expand').galleryExpand({
      onShow: onShow,
      fillScreen: true,
      inDuration: 500,
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space
