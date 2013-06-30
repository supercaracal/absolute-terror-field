var ATField = Class.create({
    SVG_NS: null,
    XLINK_NS: null,
    hasTouchEvent: null,
    hasAudioElm: null,
    svgElm: null,
    initialize: function(svgId) {
        this.SVG_NS = 'http://www.w3.org/2000/svg';
        this.XLINK_NS = 'http://www.w3.org/1999/xlink';
        this.hasTouchEvent = typeof new Element('div', {ontouchstart: 'return;'}).ontouchstart == 'function';
        this.hasAudioElm = typeof Audio == 'function' && Audio.name == 'HTMLAudioElement' && typeof Audio.prototype.canPlayType == 'function' && new Audio().canPlayType('audio/mpeg') == 'maybe';
        this.svgElm = $(svgId);
        this.setEventListener.bind(this).delay(0.5);
    },
    setEventListener: function() {
        var body = $(document.body);
        body.observe('click', this.deployATField.bindAsEventListener(this));
        if (this.hasTouchEvent) {
            body.observe('touchstart', this.deployATField.bindAsEventListener(this));
        }
    },
    deployATField: function(ev) {
        ev.stop();
        this.playSound();
        var x = this.hasTouchEvent ? ev.touches[0].pageX : ev.pageX;
        var y = this.hasTouchEvent ? ev.touches[0].pageY : ev.pageY;
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
        elm.remove.bind(elm).delay(3);
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
        return [
            [cx + Math.cos(Math.PI / 180 *  22.5) * r, cy + Math.sin(Math.PI / 180 *  22.5) * r],
            [cx + Math.cos(Math.PI / 180 *  67.5) * r, cy + Math.sin(Math.PI / 180 *  67.5) * r],
            [cx + Math.cos(Math.PI / 180 * 112.5) * r, cy + Math.sin(Math.PI / 180 * 112.5) * r],
            [cx + Math.cos(Math.PI / 180 * 157.5) * r, cy + Math.sin(Math.PI / 180 * 157.5) * r],
            [cx + Math.cos(Math.PI / 180 * 202.5) * r, cy + Math.sin(Math.PI / 180 * 202.5) * r],
            [cx + Math.cos(Math.PI / 180 * 247.5) * r, cy + Math.sin(Math.PI / 180 * 247.5) * r],
            [cx + Math.cos(Math.PI / 180 * 292.5) * r, cy + Math.sin(Math.PI / 180 * 292.5) * r],
            [cx + Math.cos(Math.PI / 180 * 337.5) * r, cy + Math.sin(Math.PI / 180 * 337.5) * r]
        ];
    },
    insertOctagon: function(elm) {
        this.svgElm.insertBefore(elm, this.svgElm.lastElementChild);
    }
});
