//header section strat 
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const hamburgerIcon = document.querySelector(".hamburger");

  menuToggle.addEventListener('click', function () {
      hamburgerIcon.classList.toggle('close');
  });
});

  
  
  
  
  // Get elements
  const mainHeading = document.getElementById('main-heading');
  const mainParagraph = document.getElementById('main-paragraph');
  const largeImage = document.getElementById('large-image');
  const smallImage = document.getElementById('small-image');
  const largeOverlay = document.querySelector('.large-image .overlay');
  const largeTextOverlay = document.querySelector('.large-image .text-overlay');

  // Add hover event for the first (large) image
  largeImage.addEventListener('mouseenter', () => {
      mainHeading.textContent = 'WHO WE ARE';
      mainParagraph.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut fermentum nisi. In tristique turpis eget ex ullamcorper, et ultricies libero tincidunt Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut fermentum nisi. In tristique turpis eget ex ullamcorper, et ultricies libero tincidunt.';
  });

  // Add hover event for the second (small) image
  smallImage.addEventListener('mouseenter', () => {
      mainHeading.textContent = 'WHAT WE DO';
      mainParagraph.textContent = 'Proin ullamcorper nisi at massa dapibus, ac fermentum lorem luctus. Vivamus et libero volutpat, euismod eros at, vulputate turpis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut fermentum nisi. In tristique turpis eget ex ullamcorper, et ultricies libero tincidunt.';
      // Show text and overlay when small image is hovered
      largeOverlay.style.opacity = "1";
      largeTextOverlay.style.opacity = "1";
  });

  smallImage.addEventListener('mouseleave', () => {
      mainHeading.textContent = 'WHO WE ARE';
      mainParagraph.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut fermentum nisi. In tristique turpis eget ex ullamcorper, et ultricies libero tincidunt Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut fermentum nisi. In tristique turpis eget ex ullamcorper, et ultricies libero tincidunt.';
      // Hide text and overlay when hover ends
      largeOverlay.style.opacity = "0";
      largeTextOverlay.style.opacity = "0";
  });

//map section
(function () {
  'use strict';
  var app = {
    touchClick: 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch ? 'touchstart' : 'click',
    addClass: function (el, className) {
      if (Array.isArray(el)) {
        for (var i = 0; i < el.length; i++) {
          addingClass(el[i], className);
        }
      } else
      {
        addingClass(el, className);
      }
      function addingClass(el, cls) {
        if (el.classList)
          el.classList.add(cls);
        else if (!app.hasClass(el, cls))
          el.className += " " + cls;
      }
    },
    removeClass: function (el, className) {
      if (Array.isArray(el)) {
        for (var i = 0; i < el.length; i++) {
          removingClass(el[i], className);
        }
      } else {
        removingClass(el, className);
      }

      function removingClass(el, cls) {
        if (el.classList)
          el.classList.remove(cls);
        else if (app.hasClass(el, cls)) {
          var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
          el.className = el.className.replace(reg, ' ');
        }
      }
    },
    hasClass: function (el, cls) {
      if (el.classList) {
        return el.classList.contains(cls);
      } else {
        return !!el.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
      }
    },
    stores: document.querySelectorAll('.marker-data'),
    pins: [],
    mesh: ["Marker"],
    popUp: document.getElementById('stores-pop-up'),
    popUpName: document.querySelector('#stores-pop-up .name'),
    popUpDesc: document.querySelector('#stores-pop-up .desc'),
    popUpImg: document.querySelector('#stores-pop-up .image'),
  };

  function init() {
    var myearth = new Earth(document.getElementById('element'), {
      location: { lat: 18, lng: 50 },
      zoom: 1.05,
      light: 'none',
      transparent: true,
      mapSeaColor: 'RGBA(255,255,255,0.50)',
      mapLandColor: '#E0E0E0',
      mapBorderColor: '#E0E0E0',
      mapBorderWidth: 0.2,
      mapHitTest: true,
      autoRotate: true,
      autoRotateSpeed: 0.7,
      autoRotateDelay: 4000,
    });

    myearth.addEventListener("ready", function () {
      for (var i = 0; i < app.stores.length; i++) {
        var long = parseInt(app.stores[i].getAttribute('data-long'));
        var lat = parseInt(app.stores[i].getAttribute('data-lat'));
        var name = app.stores[i].getAttribute('data-name');
        var desc = app.stores[i].getAttribute('data-desc');
        var img = app.stores[i].getAttribute('data-img');

        var pin = this.addMarker({
          mesh: app.mesh,
          color: '#E63020',
          offset: 0,
          location: { lat: lat, lng: long },
          scale: 0.6,
          visible: true,
          hotspot: true,
          hotspotRadius: 0.3,
          hotspotHeight: 1.2,
          name: name,
          desc: desc,
          img: img,
          active: false
        });

        app.pins.push(pin);

        // Add mouseover and mouseout events to show and hide the image
        pin.addEventListener('mouseover', function () {
          app.popUpImg.style.backgroundImage = 'url(' + this.img + ')';
          app.popUpName.innerHTML = this.name;
          app.popUpDesc.innerHTML = this.desc;
          app.addClass(document.body, 'on-popup');
        });

        pin.addEventListener('mouseout', function () {
          app.removeClass(document.body, 'on-popup');
        });

        // Click to select pin
        pin.addEventListener(app.touchClick, function () {
          if (!this.active) {
            moveEarth(this);
            resetPins();
            this.active = true;
          }
        });
      }

      this.startAutoRotate();
    });

    function resetPins() {
      for (var i = 0; i < app.pins.length; i++) {
        app.pins[i].active = false;
      }
    }

    var startLocation, rotationAngle;
    myearth.addEventListener("dragstart", function () {
      startLocation = myearth.location;
    });

    myearth.addEventListener("dragend", function () {
      rotationAngle = Earth.getAngle(startLocation, myearth.location);
    });

    function moveEarth(store) {
      myearth.goTo(store.location, { duration: 250, relativeDuration: 70 });
    }
  }

  document.addEventListener("DOMContentLoaded", function (event) {
    init();
  });
})();


var myearth = new Earth(document.getElementById('element'), {
  location: { lat: 18, lng: 50 },
  zoom: 1.05,
  light: 'none',
  transparent: true,
  // Use natural earth colors
  mapSeaColor: '#1E90FF', // Sea color (blue)
  mapLandColor: '#228B22', // Land color (green)
  mapBorderColor: '#000000', // Border color (optional)
  mapBorderWidth: 0.5,
  mapHitTest: true,
  autoRotate: true,
  autoRotateSpeed: 0.7,
  autoRotateDelay: 4000,
});



  //map section end


//tab section js 
// JavaScript to dynamically update paragraph content
const tab1Content = `At Quidich Innovation Labs, we focus on maximising airtime for our on-air assets. By centralising data and using advanced visualisation tools, we enhance storytelling with relevant data points, providing richer and more engaging live broadcasts. At Quidich Innovation Labs, we focus on maximising airtime for our on-air assets. By centralising data and using advanced visualisation tools, we enhance storytelling with relevant data points, providing richer and more engaging live broadcasts.`;

const tab2Content = `Innovation is at the core of our efforts. We are constantly pushing the boundaries to discover new possibilities that will reshape the future of technology, enabling businesses to thrive. At Quidich Innovation Labs, we focus on maximising airtime for our on-air assets. By centralising data and using advanced visualisation tools, we enhance storytelling with relevant data points, providing richer and more engaging live broadcasts. At Quidich Innovation Labs, we focus on maximising airtime for our on-air assets. By centralising data and using advanced visualisation tools, we enhance storytelling with relevant data points, providing richer and more engaging live broadcasts.`;

const tab3Content = `Our focus on Human Excellence drives us to constantly improve. We believe in the power of collaboration and dedication to achieve success in every aspect of life. At Quidich Innovation Labs, we focus on maximising airtime for our on-air assets. By centralising data and using advanced visualisation tools, we enhance storytelling with relevant data points, providing richer and more engaging live broadcasts. At Quidich Innovation Labs, we focus on maximising airtime for our on-air assets. By centralising data and using advanced visualisation tools, we enhance storytelling with relevant data points, providing richer and more engaging live broadcasts. At Quidich Innovation Labs, we focus on maximising airtime for our on-air assets. By centralising data and using advanced visualisation tools, we enhance storytelling with relevant data points, providing richer and more engaging live broadcasts.`;

// Reference to the paragraph element
const paragraphElement = document.getElementById('paragraph');

// Event listeners for tabs
document.getElementById('tab1').addEventListener('change', function() {
  paragraphElement.textContent = tab1Content;
});

document.getElementById('tab2').addEventListener('change', function() {
  paragraphElement.textContent = tab2Content;
});

document.getElementById('tab3').addEventListener('change', function() {
  paragraphElement.textContent = tab3Content;
});



// <![CDATA[  <-- For SVG support
if ('WebSocket' in window) {
(function () {
  function refreshCSS() {
    var sheets = [].slice.call(document.getElementsByTagName("link"));
    var head = document.getElementsByTagName("head")[0];
    for (var i = 0; i < sheets.length; ++i) {
      var elem = sheets[i];
      var parent = elem.parentElement || head;
      parent.removeChild(elem);
      var rel = elem.rel;
      if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
        var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
        elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
      }
      parent.appendChild(elem);
    }
  }
  var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
  var address = protocol + window.location.host + window.location.pathname + '/ws';
  var socket = new WebSocket(address);
  socket.onmessage = function (msg) {
    if (msg.data == 'reload') window.location.reload();
    else if (msg.data == 'refreshcss') refreshCSS();
  };
  if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
    console.log('Live reload enabled.');
    sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
  }
})();
}
else {
console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
}
// ]]>




    
