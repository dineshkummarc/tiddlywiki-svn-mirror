//{{{
(function($) {

    config.macros.readyDemoFade = {
        ready: function () {
            $(this).fadeOut("slow").fadeIn("slow");
        }
    };

    config.macros.readyDemoSlide = {
        ready: function () {
            $(this).slideUp("slow").slideDown("slow");
        }
    };

})(jQuery);
//}}}
