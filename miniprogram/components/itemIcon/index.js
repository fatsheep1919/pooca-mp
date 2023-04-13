// components/itemIcon/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {
      type: Number,
      value: 48
    },
    icon: {
      type: Object,
      observer: function(val) {
        if (val) {
          const { name, color, alt } = val;
          this.setData({ name, color, alt });
        }
      }
    },
    text: {
      type: String,
      observer: function(val) {
        this.setData({
          text: val || '',
        });
      }
    },
    showText: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    name: null,
    color: null,
    alt: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
