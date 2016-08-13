var ATField = Class.create({
  SVG_NS: null,
  XLINK_NS: null,
  hasTouchEvent: null,
  hasAudioElm: null,
  svgElm: null,
  initialize: function(svgId) {
    this.SVG_NS = 'http://www.w3.org/2000/svg';
    this.XLINK_NS = 'http://www.w3.org/1999/xlink';
    // MIXME:
    // this.hasTouchEvent = typeof new Element('div', {ontouchstart: 'return;'}).ontouchstart == 'function';
    this.hasTouchEvent = false;
    var canPlayMpeg = typeof Audio == 'function' && Audio.name == 'HTMLAudioElement' &&
        typeof Audio.prototype.canPlayType == 'function' && new Audio().canPlayType('audio/mpeg');
    this.hasAudioElm = canPlayMpeg == 'probably' || canPlayMpeg == 'maybe';
    this.svgElm = $(svgId);
    this.setEventListener.bind(this).delay(0.5);
  },
  setEventListener: function() {
    var body = $(document.body);
    body.observe(this.hasTouchEvent ? 'touchstart' : 'click',
      this.deployATField.bindAsEventListener(this));
  },
  deployATField: function(ev) {
    this.playSound();
    var x = this.hasTouchEvent ? ev.touches[0].pageX : ev.pageX ,
      y = this.hasTouchEvent ? ev.touches[0].pageY : ev.pageY;
    ev.stop();
    this.ripple(x, y, 50);
  },
  playSound: function() {
    if (!this.hasAudioElm) return;
    var sound = new Element('audio', {src: '/at_field.mp3'});
    if (Prototype.Browser.MobileSafari) sound.load();
    try {
      sound.play();
    } catch(e) {
      if (console) console.log(e);
    }
  },
  ripple: function(x, y, r) {
    if (300 < r) return;
    var elm = this.createOctagon(this.generateOctagonPoints(x, y, r));
    this.insertOctagon(elm);
    this.ripple.bind(this).delay(0.03, x, y, r + 50);
    if ('remove' in elm) elm.remove.bind(elm).delay(3);
  },
  createOctagon: function(points) {
    var elm = document.createElementNS(this.SVG_NS, 'polygon');
    elm.setAttributeNS(null, 'points', points.map(function(x) { return x.join(','); }).join(' '));
    elm.setAttributeNS(null, 'stroke', '#FF6600');
    elm.setAttributeNS(null, 'fill', 'url(#grad01)');
    elm.setAttributeNS(null, 'stroke-width', '1');
    elm.setAttributeNS(null, 'stroke-opacity', '0.9');
    elm.setAttributeNS(null, 'opacity', '0.9');
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
