var ATField = Class.create({
  SVG_NS: null,
  XLINK_NS: null,
  hasMousedownEvent: null,
  hasTouchEvent: null,
  hasAudioElm: null,
  svgElm: null,

  initialize: function(svgId) {
    this.SVG_NS = 'http://www.w3.org/2000/svg';
    this.XLINK_NS = 'http://www.w3.org/1999/xlink';
    this.hasMousedownEvent = typeof new Element('div', {onmousedown: 'return;'}).onmousedown == 'function';
    this.hasTouchEvent = typeof new Element('div', {ontouchstart: 'return;'}).ontouchstart == 'function';
    var canPlayMpeg = typeof Audio == 'function' &&
                      Audio.name == 'HTMLAudioElement' &&
                      typeof Audio.prototype.canPlayType == 'function' &&
                      new Audio().canPlayType('audio/mpeg');
    this.hasAudioElm = canPlayMpeg == 'probably' || canPlayMpeg == 'maybe';
    this.svgElm = $(svgId);
    this.setEventListener.bind(this).delay(0.5);
  },

  setEventListener: function() {
    var body = $(document.body);
    if (this.hasMousedownEvent) {
      body.observe('mousedown', this.deployATField.bindAsEventListener(this));
    }
    if (this.hasTouchEvent) {
      body.observe('touchstart', this.deployATField.bindAsEventListener(this));
    }
  },

  deployATField: function(ev) {
    var x, y;
    this.playSound();
    if (ev.type === 'mousedown') {
      x = ev.pageX;
      y = ev.pageY;
    } else {
      x = ev.touches[0].pageX;
      y = ev.touches[0].pageY;
    }
    ev.stop();
    this.ripple(x, y, 50);
  },

  playSound: function() {
    if (!this.hasAudioElm) {
      return;
    }
    var sound = new Element('audio', {src: '/at_field.mp3'});
    if (Prototype.Browser.MobileSafari) {
      sound.load();
    }
    try {
      sound.play();
    } catch(e) {
      if (console) {
        console.log(e);
      }
    }
  },

  ripple: function(x, y, r) {
    if (300 < r) {
      return;
    }
    var elm = this.createOctagon(this.generateOctagonPoints(x, y, r));
    this.insertOctagon(elm);
    this.ripple.bind(this).delay(0.03, x, y, r + 50);
    if ('remove' in elm) {
      elm.remove.bind(elm).delay(3);
    }
  },

  createOctagon: function(points) {
    var elm = document.createElementNS(this.SVG_NS, 'polygon');
    var point_str =  points.map(function(x) { return x.join(','); }).join(' ');
    elm.setAttributeNS(null, 'points',         point_str);
    elm.setAttributeNS(null, 'stroke',         '#FF6600');
    elm.setAttributeNS(null, 'fill',           'url(#grad01)');
    elm.setAttributeNS(null, 'stroke-width',   '1');
    elm.setAttributeNS(null, 'stroke-opacity', '0.9');
    elm.setAttributeNS(null, 'opacity',        '0.9');
    return elm;
  },

  generateOctagonPoints: function(cx, cy, r) {
    var theta = 360 / 8 ,
      rotateDeg = theta / 2 ,
      radian = Math.PI / 180;
    return $A($R(0, 7)).map(function(x) {
      return [
        cx + Math.cos(radian * (theta * x + rotateDeg)) * r,
        cy + Math.sin(radian * (theta * x + rotateDeg)) * r
      ];
    });
  },

  insertOctagon: function(elm) {
    this.svgElm.insertBefore(elm, this.svgElm.lastElementChild);
  }
});
