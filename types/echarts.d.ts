import Vue from 'vue'

/** Echarts Component */
export declare class ECharts extends Vue {
  echarts: object
  onInit?: () => object
  canvasId?: string
  lazyLoad?: boolean
  disableTouch?: boolean
}
