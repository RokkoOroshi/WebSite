'use strict';

$('a[href^=#]').click(function() {
    var time = 500;
    var offsetY = -1 * $('#home-menu').height();
    var target = $(this.hash);
    if (!target.length){ return true; }
    var targetY = target.offset().top + offsetY;
    $('html,body').animate({ scrollTop: targetY }, time, 'swing');
    window.history.pushState(null, null, this.hash);
    return false;
});
