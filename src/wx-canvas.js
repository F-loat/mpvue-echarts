export default class WxCanvas {
  constructor(ctx, canvasId, isNew, canvasNode) {
    this.ctx = ctx;
    this.canvasId = canvasId;
    this.chart = null;
    this.isNew = isNew;
    if (isNew) {
      this.canvasNode = canvasNode;
    } else {
      this._initStyle(ctx);
    }

    this._initEvent();
  }

  getContext(contextType) {
    if (contextType === '2d') {
      return this.ctx;
    }
    return null;
  }

  setChart(chart) {
    this.chart = chart;
  }

  addEventListener() {
    // noop
  }

  attachEvent() {
    // noop
  }

  detachEvent() {
    // noop
  }

  _initStyle(ctx) {
    ctx.createRadialGradient = () => ctx.createCircularGradient(arguments);
  }

  _initEvent() {
    this.event = {};
    const eventNames = [{
      wxName: 'touchStart',
      ecName: 'mousedown',
    }, {
      wxName: 'touchMove',
      ecName: 'mousemove',
    }, {
      wxName: 'touchEnd',
      ecName: 'mouseup',
    }, {
      wxName: 'touchEnd',
      ecName: 'click',
    }];
    eventNames.forEach((name) => {
      this.event[name.wxName] = (e) => {
        const touch = e.touches[0];
        this.chart.getZr().handler.dispatch(name.ecName, {
          zrX: name.wxName === 'tap' ? touch.clientX : touch.x,
          zrY: name.wxName === 'tap' ? touch.clientY : touch.y,
          preventDefault: () => {},
          stopImmediatePropagation: () => {},
          stopPropagation: () => {},
        });
      };
    });
  }

  set width(w) {
    if (this.canvasNode) this.canvasNode.width = w;
  }
  set height(h) {
    if (this.canvasNode) this.canvasNode.height = h;
  }

  get width() {
    if (this.canvasNode) { return this.canvasNode.width; }
    return 0;
  }
  get height() {
    if (this.canvasNode) { return this.canvasNode.height; }
    return 0;
  }
}
