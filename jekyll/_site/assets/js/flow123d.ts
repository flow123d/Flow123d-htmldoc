interface Window {
  katex: any;
}
$(document).ready(function() {
  
  var $sections = $('#ist section');
  var $menuLinks = $('.menu li a');
  var $eqs = $('.tex');
  var firstID = $($sections.get(0)).attr('id');
  var $lastEmp = null;
  var $lastLink = null;
  
  var replaceAllSlashes = function (str, replace) {
    return str.replace(/\\\\/g, replace);
  };

  var expandMD = function(item) {
      var $item = $(item);
      $item.removeClass('tex');
      
      var text = $item.text().trim();
      text = text.substring(1, text.length - 1).trim();
      if (text.charAt(0) == "$") {
          text = text.substring(1, text.length - 1).trim();
      }
      
      try {
        var fixed = replaceAllSlashes(text, '\\');
        window.katex.render(fixed, item);
      } catch (e) {
        console.log(e);
        try {
          window.katex.render(text, item);
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
  }

  var getHash = function(secure=false) {
    var hash = window.location.hash;
    return secure ? hash.replace(':', '\\:') : hash.substr(1);
  }

  var switchView = function (newhash:string, recursive:boolean=false) {
    if ($lastEmp) {
      $lastEmp.removeClass('emph');
      $lastEmp = null;
    }
    if ($lastLink) {
      $lastLink.removeClass('emph');
      $lastLink = null;
    }
    
    var elem = document.getElementById(newhash);
    if (elem) {
      console.log('change to %c%s', 'color: darkgreen;', newhash);
      var $elem = $(elem);
      var $parent = $elem.closest('section');
      var same = $elem.attr('id') == $parent.attr('id');

      if (same) {
        $sections.hide();
        $parent.show();
      } else {
        $sections.hide();
        $parent.show();
        $elem.addClass('emph');
        $lastEmp = $elem;
      }
      
      var linkHash = '#' + $parent.attr('id');
      var $linkElem = $(`.menu a[href='${linkHash}']`);
      if($linkElem.length > 0) {
        $linkElem.addClass('emph');
        console.log($linkElem.get(0));
        console.log($('.menu').get(0));
        $('.menu').css('height', $(window).height() + 'px');
        $linkElem.get(0).scrollIntoView({behavior: 'smooth'});
        $lastLink = $linkElem;
      }
      
    } else {
      if (!recursive) {
        console.log('change to %c%s [broken]', 'color: darkred;', newhash);
        switchView(firstID, true);
      } else {
        console.log('%cFatal error, cannot find suitable element to display', 'color: darkred; font-weight: bold');
      }
    }
  }
  
  
  // eqs.each(function(index, item) {
  //   // expandMD(item);
  // });
  
  $eqs.onScreen({
    container: window,
    direction: 'vertical',
    doIn: function() {
      if($(this).hasClass('tex')) {
        expandMD(this);
      }
    },
    doOut: function() {
    },
    tolerance: -200,
    debug: false,
    debounce: 5000,
  });
  
  $( window ).resize(function() {
    $('.menu').css('height', $(window).height() + 'px');
  });
  
  $('a').click(function() {
    var nhash = $(this).attr('href');
    window.location.hash = nhash;
    return false;
  });
  
  $(window).on('hashchange', function() {
    switchView(getHash());
  });
  
  $('.menu').css('height', $(window).height() + 'px');
  setTimeout(function () {
    $(window).trigger('hashchange');
  }, 100);
});


