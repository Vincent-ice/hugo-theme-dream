"use strict";

document.addEventListener('alpine:init', function () {
  Alpine.store('darkMode', {
    init: function init() {
      var _this = this;
      var isDark = window.localStorage.getItem('hugo-theme-dream-is-dark');
      if (isDark) {
        this.on = isDark;
      } else {
        this.mql.addEventListener('change', function (event) {
          _this.on = event.matches ? 'y' : 'n';
        });
        this.on = 'auto';
      }
      setTimeout(function () {
        _this.setThemeForUtterances();
      }, 6000);
    },
    mql: window.matchMedia('(prefers-color-scheme: dark)'),
    on: 'n',
    isDark: function isDark() {
      return this.on === 'auto' ? this.mql.matches : this.on === 'y';
    },
    "class": function _class() {
      if (this.on === 'auto') {
        return this.mql.matches ? 'dark' : 'light';
      } else {
        return this.on === 'y' ? 'dark' : 'light';
      }
    },
    theme: function theme() {
      if (this.on === 'auto') {
        return this.mql.matches ? window.darkTheme : window.lightTheme;
      } else {
        return this.on === 'y' ? window.darkTheme : window.lightTheme;
      }
    },
    iconMap: {
      n: 'sunny',
      y: 'moon',
      auto: 'desktop'
    },
    icon: function icon() {
      return this.iconMap[this.on];
    },
    toggle: function toggle(status) {
      this.on = status;
      if (status === 'auto') {
        window.localStorage.removeItem('hugo-theme-dream-is-dark');
      } else {
        window.localStorage.setItem('hugo-theme-dream-is-dark', status);
      }
      this.setThemeForUtterances();
      this.changeSyntaxHighlightingTheme();
    },
    changeSyntaxHighlightingTheme: function changeSyntaxHighlightingTheme() {
      if (document.querySelector('#dream-single-post-main')) {
        var customSyntaxHighlightingUrl = this.isDark() ? window.customSyntaxHighlighting.dark : window.customSyntaxHighlighting.light;
        document.querySelector('link[data-custom-syntax-highlighting]').setAttribute('href', customSyntaxHighlightingUrl);
      }
    },
    setThemeForUtterances: function setThemeForUtterances() {
      var utterances = document.querySelector('iframe.utterances-frame');
      if (utterances) {
        utterances.contentWindow.postMessage({
          type: 'set-theme',
          theme: this.isDark() ? 'github-dark' : 'github-light'
        }, 'https://utteranc.es');
      }
    }
  });
});

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollTopButton()};

function scrollTopButton() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("goTopBtn").style.display = "block";
  } else {
    document.getElementById("goTopBtn").style.display = "none";
  }
}

//Smooth scroll to the top of the document
function smoothScrollTop(){
    var timer  = null;
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn(){
        var oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if(oTop > 0){
            document.body.scrollTop = document.documentElement.scrollTop = oTop - 1000;
            timer = requestAnimationFrame(fn);
        }else{
            cancelAnimationFrame(timer);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
  const footnoteLinks = document.querySelectorAll('.footnote-ref');

  footnoteLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const footnotes = document.querySelectorAll('.footnote-backref');

  footnotes.forEach(footnote => {
    footnote.addEventListener('click', function(event) {
      event.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
});