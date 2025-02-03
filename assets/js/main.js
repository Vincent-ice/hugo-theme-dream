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
    window.scroll({
        top: 0,
        behavior: 'smooth'
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

document.addEventListener("DOMContentLoaded", function() {
  const tocLinks = document.querySelectorAll("#TableOfContents a");
  const sections = Array.from(tocLinks).map(link => {
    const href = link.getAttribute("href");
    if (href.startsWith("#")) {
      return document.getElementById(href.slice(1));
    }
    return null;
  }).filter(section => section !== null);
  const offset = 100;

  function onScroll() {
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    sections.forEach((section, index) => {
      if (section.offsetTop - offset <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
        tocLinks.forEach(link => link.classList.remove("active"));
        tocLinks[index].classList.add("active");

        // 添加 active 类到所有父级目录项
        let parentLi = tocLinks[index].closest('li');
        while (parentLi) {
          const parentLink = parentLi.querySelector('a');
          if (parentLink) {
            parentLink.classList.add('active');
          }
          parentLi = parentLi.parentElement.closest('li');
        }

        const tocContainer = document.querySelector("#TableOfContents");
        const activeLink = tocLinks[index];
        const activeLinkRect = activeLink.getBoundingClientRect();
        const tocContainerRect = tocContainer.getBoundingClientRect();
        const activeLinkOffsetTop = activeLinkRect.top - tocContainerRect.top + tocContainer.scrollTop - 50;
        tocContainer.scrollTo({
          top: activeLinkOffsetTop,
          behavior: "smooth"
        });
      }
    });
  }

  document.addEventListener("scroll", onScroll);

  tocLinks.forEach(link => {
    link.addEventListener("click", function(event) {
      event.preventDefault(); // 阻止默认的跳转行为
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      // 平滑滚动到目标元素
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth"
      });
      setTimeout(onScroll, 10);

      // 添加 active 类到所有父级目录项
      tocLinks.forEach(link => link.classList.remove("active"));
      this.classList.add("active");
      let parentLi = this.closest('li');
      while (parentLi) {
        const parentLink = parentLi.querySelector('a');
        if (parentLink) {
          parentLink.classList.add('active');
        }
        parentLi = parentLi.parentElement.closest('li');
      }
    });
  });
});