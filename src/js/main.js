$(document).ready(function() {
    var eqs = $('.md-expression');
    var first_katex = true;
    var replaceAll = function (str, replace) {
      return str.replace(/\\\\/g, replace);
    };
    eqs.each(function(index, item) {
        var $item = $(item);
        var text = $item.text();
        text = text.substring(1, text.length - 1).trim();
        if (text.charAt(0) == "$")
            text = text.substring(1, text.length - 1).trim();

        try {
          katex.render(text, item);
          if (first_katex) {
            console.log("Error(s) during latex expression rendering:");
            first_katex = false;
          }
        } catch (e) {
          try {
            var fixed = replaceAll(text, '\\')
            katex.render(fixed, item);

            console.warn('WARNING: Expression changed');
            console.log($(item).parentsUntil('#ist').last()[0]);
            console.log('before: ' + text);
            console.log('after:  ' + fixed);
            console.log('');
          } catch (e) {
            console.error('ERROR: Invalid latex expression!');
            console.log($(item).parentsUntil('#ist').last()[0]);
            console.log('tried: ' + text);
            console.log('tried: ' + fixed);
            console.log('');
          } finally {
          }

        } finally {
        }

    });

    var $navigation = $('.navigation');
    var root = '#Root';
    var $root = $(root);
    var $toggles = $('.toggle-btn');
    var $nav = $('#nav');
    var didScroll = false;
    var lastScroll = $(document).scrollTop();

    $( window ).scroll(function() {
        var tmp = $(document).scrollTop();
        var down = tmp > lastScroll;
        lastScroll = tmp;

        if (tmp > 64) {
            $nav.addClass('small');
        } else {
                $nav.removeClass('small');
        }

        if (down) {
            if (tmp > 64) {
                $nav.addClass('down');
            }
        } else {
            $nav.removeClass('down');
        }

        fixSidebar();
    });

    var fixSidebar = function () {
      return;
        var tmp = $(document).scrollTop();
        if(tmp < 90) {
            $navigation.css('top', 90 - tmp);
        } else {
            $navigation.css('top', 0);
        }
    };

    var isSingleMode = function () {
        return !$toggles.hasClass('active');
    };

    var setHash = function(value) {
        window.location.hash = value;
        // $(window).trigger('hashchange');
    };

    var getHash = function(full) {
        if(full)
            return window.location.hash;
        return trim(window.location.hash);
    };

    var trim = function(value) {
        if(value && value.indexOf(':') != -1)
            return value.substr(0, value.indexOf(':'));
        return value;
    };

    var secure = function(value) {
        if(value)
            return value.replace(':', '\\:');
        return value;
    };


    var getActive = function () {
        var elemID = getHash();
        if (elemID) {
            var $elem = $(elemID);
            if ($elem.hasClass('main-section'))
                return $elem;
        }
        return null;
    };

    var getActiveField = function() {
        var elemID = getHash(true);
        if (!elemID) return null;
        if (elemID.indexOf(':') == -1) return null;
        return $(secure(elemID));
    }

    var showSingle = function($elem) {
        $('.main-section').addClass('hidden');
        $elem.removeClass('hidden');
    };

    var updateView = function() {
        singleMode = isSingleMode();
        var $active = getActive();

        if($active) {
            $navigation.find('li').removeClass('active');
            var selector = getHash().replace('#', '.item_');
            $navigation.find(selector).parent().addClass('active');
        }

        if(singleMode) {
            if (!$active) {
                showSingle($root);
                return;
            }
            showSingle($active);
        } else {
            if ($active) {
                $active.removeClass('hidden');
            }
        }
    };

    $toggles.click(function() {
        var $this = $(this);
        var $family = $($this.data('family'))
        var isActive = $family.hasClass('active');

        $family.toggleClass('active');
        var filter = $family.data('filter');
        if($family.hasClass('active')) {
            $(filter).removeClass('hidden');
        } else {
            $(filter).addClass('hidden');
        }

        updateView();
        return false;
    });

    $(window).bind('hashchange', function(e) {
        updateView();
    });

    $(window).resize(function() {
        fixSidebar();
    });

    $('a[href^="#"]').click(function(e) {
        var href = this.getAttribute("href");
        if (href == '#')
            return true;

        var $href = $(trim(href));
        if (isSingleMode()) {
            showSingle($href);
            setHash(href);
            $(window).scrollTop(0);
            return false;
        } else {
            $href.removeClass('hidden');
            setHash(href);
            return false;
        }
    });

    $('.show-root').click(function(e) {
        $toggles.removeClass('active');
        setHash(root);
        updateView();
        return false;
    });

    updateView();
    fixSidebar();
    $('.button-collapse').sideNav();
});
