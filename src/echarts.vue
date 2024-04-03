<template>
  <canvas v-if="_canvasId" class="ec-canvas" type="2d" :id="_canvasId" :canvasId="_canvasId" @touchstart="touchStart"
    @touchmove="touchMove" @touchend="touchEnd">
  </canvas>
</template>

<script>
import WxCanvas from './wx-canvas';

function wrapTouch(event) {
  for (let i = 0; i < event.touches.length; ++i) {
    const touch = event.touches[i];
    touch.offsetX = touch.x;
    touch.offsetY = touch.y;
  }
  return event;
}

export default {
  props: {
    echarts: {
      required: true,
      type: Object,
      default() {
        return null;
      },
    },
    onInit: {
      type: Function,
      default: null,
    },
    canvasId: {
      type: String,
      default: 'ec-canvas',
    },
    lazyLoad: {
      type: Boolean,
      default: false,
    },
    disableTouch: {
      type: Boolean,
      default: false,
    },
  },
  onReady() {
    if (!this.echarts) {
      console.warn('组件需绑定 echarts 变量');
      return;
    }

    if (!this.lazyLoad) this.init();
  },
  data() {
    return {
      tryQuery: 0,
    };
  },
  computed: {
    _canvasId() {
      return this.canvasId.toLocaleLowerCase();
    },
  },
  methods: {
    init(callback) {
      const query = wx.createSelectorQuery();

      query
        .select(`#${this._canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0] || !res[0].node) {
            setTimeout(() => {
              this.tryQuery++;
              if (this.tryQuery >= 10) {
                this.tryQuery = 0;
                console.warn('canvas 节点始终未找到');
                return;
              }
              this.init(callback);
            }, 100);
            return;
          }

          const canvasNode = res[0].node;
          this.canvasNode = canvasNode;

          console.log('canvas 节点', canvasNode);

          const canvasDpr = wx.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;

          const ctx = canvasNode.getContext('2d');

          const canvas = new WxCanvas(ctx, this.canvasId, true, canvasNode);

          if (this.echarts.setPlatformAPI) {
            this.echarts.setPlatformAPI({
              createCanvas: () => canvas,
              loadImage: (src, onload, onerror) => {
                if (canvasNode.createImage) {
                  const image = canvasNode.createImage();
                  image.onload = onload;
                  image.onerror = onerror;
                  image.src = src;
                  return image;
                }
                console.error('加载图片依赖 `Canvas.createImage()` API，要求小程序基础库版本在 2.7.0 及以上。');
                return null;
                // PENDING fallback?
              },
            });
          } else {
            this.echarts.setCanvasCreator(() => canvas);
          }

          if (typeof callback === 'function') {
            this.chart = callback(canvas, canvasWidth, canvasHeight, canvasDpr);
          } else if (typeof this.onInit === 'function') {
            this.chart = this.onInit(canvas, canvasWidth, canvasHeight, canvasDpr);
          } else {
            this.$emit('init', {
              canvas,
              canvasWidth,
              canvasHeight,
              canvasDpr,
            });
          }
        });
    },
    canvasToTempFilePath(opt) {
      const query = wx.createSelectorQuery();
      query
        .select(`#${this._canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0] || !res[0].node) {
            setTimeout(() => {
              this.tryQuery++;
              if (this.tryQuery >= 10) {
                this.tryQuery = 0;
                console.warn('canvas 节点始终未找到');
                return;
              }
              this.canvasToTempFilePath(opt);
            }, 100);
            return;
          }

          const canvasNode = res[0].node;
          wx.canvasToTempFilePath({
            ...opt,
            canvas: canvasNode,
          });
        });
    },

    touchStart(e) {
      if (this.disableTouch || !this.chart || !e.touches.length) return;

      const touch = e.touches[0];
      const { handler } = this.chart.getZr();
      handler.dispatch('mousedown', {
        zrX: touch.x,
        zrY: touch.y,
        preventDefault: () => { },
        stopImmediatePropagation: () => { },
        stopPropagation: () => { },
      });
      handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y,
        preventDefault: () => { },
        stopImmediatePropagation: () => { },
        stopPropagation: () => { },
      });
      handler.processGesture(wrapTouch(e), 'start');
    },

    touchMove(e) {
      if (this.disableTouch || !this.chart || !e.touches.length) return;

      const touch = e.touches[0];
      const { handler } = this.chart.getZr();
      handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y,
        preventDefault: () => { },
        stopImmediatePropagation: () => { },
        stopPropagation: () => { },
      });
      handler.processGesture(wrapTouch(e), 'change');
    },

    touchEnd(e) {
      if (this.disableTouch || !this.chart) return;

      const touch = e.changedTouches ? e.changedTouches[0] : {};
      const { handler } = this.chart.getZr();
      handler.dispatch('mouseup', {
        zrX: touch.x,
        zrY: touch.y,
        preventDefault: () => { },
        stopImmediatePropagation: () => { },
        stopPropagation: () => { },
      });
      handler.dispatch('click', {
        zrX: touch.x,
        zrY: touch.y,
        preventDefault: () => { },
        stopImmediatePropagation: () => { },
        stopPropagation: () => { },
      });
      handler.processGesture(wrapTouch(e), 'end');
    },
  },

};
</script>

<style scoped>
.ec-canvas {
  width: 100%;
  height: 100%;
}
</style>
