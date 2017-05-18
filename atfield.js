(function f(global) {
  'use strict';

  var g = global;

  g.ATField = global.Class.create({
    SVG_NS: null,
    XLINK_NS: null,
    hasMousedownEvent: null,
    hasTouchEvent: null,
    hasAudioElm: null,
    svgElm: null,

    initialize: function initialize(svgId) {
      var canPlayMpeg = typeof Audio === 'function' &&
                        Audio.name === 'HTMLAudioElement' &&
                        typeof Audio.prototype.canPlayType === 'function' &&
                        new Audio().canPlayType('audio/mpeg');

      this.SVG_NS = 'http://www.w3.org/2000/svg';
      this.XLINK_NS = 'http://www.w3.org/1999/xlink';
      this.hasMousedownEvent = typeof new Element('div', { onmousedown: 'return;' }).onmousedown === 'function';
      this.hasTouchEvent = typeof new Element('div', { ontouchstart: 'return;' }).ontouchstart === 'function';
      this.hasAudioElm = canPlayMpeg === 'probably' || canPlayMpeg === 'maybe';
      this.svgElm = global.$(svgId);
    },

    ready: function ready() {
      this.setEventListener.bind(this).delay(0.5);
    },

    setEventListener: function setEventListener() {
      var body = global.$(document.body);
      if (this.hasMousedownEvent) {
        body.observe('mousedown', this.deployATField.bindAsEventListener(this));
      }
      if (this.hasTouchEvent) {
        body.observe('touchstart', this.deployATField.bindAsEventListener(this));
      }
    },

    deployATField: function deployATField(ev) {
      var x;
      var y;
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

    playSound: function playSound() {
      var sound;
      if (!this.hasAudioElm) {
        return;
      }
      sound = new Element('audio', { src: '/absolute-terror-field/atfield.mp3' });
      if (global.Prototype.Browser.MobileSafari) {
        sound.load();
      }
      try {
        sound.play();
      } catch (e) {
        //
      }
    },

    ripple: function ripple(x, y, r) {
      var elm;
      if (r > 300) {
        return;
      }
      elm = this.createOctagon(this.generateOctagonPoints(x, y, r));
      this.insertOctagon(elm);
      this.ripple.bind(this).delay(0.03, x, y, r + 50);
      if ('remove' in elm) {
        elm.remove.bind(elm).delay(3);
      }
    },

    createOctagon: function createOctagon(points) {
      var elm = document.createElementNS(this.SVG_NS, 'polygon');
      var pointStr = points.map(function fj(x) { return x.join(','); }).join(' ');
      elm.setAttributeNS(null, 'points', pointStr);
      elm.setAttributeNS(null, 'stroke', '#FF6600');
      elm.setAttributeNS(null, 'fill', 'url(#grad01)');
      elm.setAttributeNS(null, 'stroke-width', '1');
      elm.setAttributeNS(null, 'stroke-opacity', '0.9');
      elm.setAttributeNS(null, 'opacity', '0.9');
      return elm;
    },

    generateOctagonPoints: function generateOctagonPoints(cx, cy, r) {
      var theta = 360 / 8;
      var rotateDeg = theta / 2;
      var radian = Math.PI / 180;
      return global.$A(global.$R(0, 7)).map(function fc(x) {
        return [
          cx + (Math.cos(radian * ((theta * x) + rotateDeg)) * r),
          cy + (Math.sin(radian * ((theta * x) + rotateDeg)) * r)
        ];
      });
    },

    insertOctagon: function insertOctagon(elm) {
      this.svgElm.insertBefore(elm, this.svgElm.lastElementChild);
    }
  });
}(window));
