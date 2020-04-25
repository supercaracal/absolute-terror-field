(function ($) {
  "use strict";

  const ID_SVG = 'js-svg';
  const ID_RAD_GRAD = 'js-rad-grad';
  const NS_SVG = 'http://www.w3.org/2000/svg';
  const PATH_SE = '/absolute-terror-field/se.mp3';
  const MIN_SHAPE_SIZE = 50;
  const MAX_SHAPE_SIZE = 300;
  const NUMBER_OF_SHAPES = 8;
  const DISPLAY_DELAY_MSEC = 30;
  const DISPLAY_DURATION_MSEC = 3000;

  $.addEventListener('load', (event) => {
    const ctx = createContext(event.target);
    const handler = createHandler(ctx);
    if (ctx.hasMousedownEvent) {
      ctx.document.body.addEventListener('mousedown', handler);
    } else if (ctx.hasTouchEvent) {
      ctx.document.body.addEventListener('touchstart', handler);
    }
  });

  function createContext(document) {
    const canPlayMpeg = typeof Audio === 'function' && $.Audio.name === 'Audio'
      && typeof $.Audio.prototype.canPlayType === 'function'
      && new $.Audio().canPlayType('audio/mpeg');
    const svg = document.getElementById(ID_SVG);
    const div = document.createElement('div');
    div.onmousedown = () => {};
    div.ontouchstart = () => {};
    return {
      document: document,
      hasMousedownEvent: typeof div.onmousedown === 'function',
      hasTouchEvent: typeof div.ontouchstart === 'function',
      canPlayAudio: canPlayMpeg === 'probably' || canPlayMpeg === 'maybe',
      svg: svg,
      radialGradientId: ID_RAD_GRAD,
      svgNamespace: NS_SVG,
      soundEffectFilePath: PATH_SE,
      minShapeSize: MIN_SHAPE_SIZE,
      maxShapeSize: MAX_SHAPE_SIZE,
      numberOfShapes: NUMBER_OF_SHAPES,
      displayDelayMsec: DISPLAY_DELAY_MSEC,
      displayDurationMsec: DISPLAY_DURATION_MSEC,
    };
  }

  function createHandler(ctx) {
    return (event) => generateAbsoluteTerrorField(event, ctx);
  }

  function generateAbsoluteTerrorField(event, ctx) {
    let x, y;
    if (event.type === 'mousedown') {
      x = event.pageX;
      y = event.pageY;
    } else if (event.type === 'touchstart') {
      x = event.touches[0].pageX;
      y = event.touches[0].pageY;
    } else {
      return;
    }
    event.stopPropagation();
    playSoundEffect(ctx);
    animateShape(ctx, x, y, ctx.minShapeSize);
  }

  function playSoundEffect(ctx) {
    if (!ctx.canPlayAudio) {
      return;
    }
    const audio = new $.Audio(ctx.soundEffectFilePath);
    audio.play()
      .then((r) => {})
      .catch((e) => console.log(e));
  }

  function animateShape(ctx, x, y, r) {
    if (r > ctx.maxShapeSize) {
      return;
    }
    const points = generateOctagonPoints(ctx, x, y, r);
    const octagon = createOctagon(ctx, points);
    ctx.svg.insertBefore(octagon, ctx.svg.lastElementChild);
    $.setTimeout(animateShape, ctx.displayDelayMsec, ctx, x, y, r + ctx.minShapeSize);
    $.setTimeout(() => octagon.remove(), ctx.displayDurationMsec);
  }

  function generateOctagonPoints(ctx, cx, cy, r) {
    const theta = 360 / 8;
    const rotateDeg = theta / 2;
    const radian = Math.PI / 180;
    return [...Array(ctx.numberOfShapes)].map((_, i) => i).map((x) => {
      return [
        cx + (Math.cos(radian * ((theta * x) + rotateDeg)) * r),
        cy + (Math.sin(radian * ((theta * x) + rotateDeg)) * r)
      ];
    });
  }

  function createOctagon(ctx, points) {
    const elm = ctx.document.createElementNS(ctx.svgNamespace, 'polygon');
    const pointStr = points.map((x) => x.join(',')).join(' ');
    elm.setAttributeNS(null, 'points', pointStr);
    elm.setAttributeNS(null, 'stroke', '#FF6600');
    elm.setAttributeNS(null, 'fill', 'url(#' + ctx.radialGradientId + ')');
    elm.setAttributeNS(null, 'stroke-width', '1');
    elm.setAttributeNS(null, 'stroke-opacity', '0.9');
    elm.setAttributeNS(null, 'opacity', '0.9');
    return elm;
  }
}(window));
