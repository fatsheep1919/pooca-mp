// components/iconSelectDialog/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    icon: {
      type: String,
      observer: function(val) {
        this.setData({
          selectedIcon: val
        })
      }
    },
    color: {
      type: String,
      observer: function(val) {
        this.setData({
          selectedColor: val
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedIcon: null,
    selectedColor: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateIcon(e) {
      const icon = e.currentTarget.dataset['icon'];
      this.setData({
        selectedIcon: icon
      });
    },
    updateColor(e) {
      const color = e.currentTarget.dataset['color'];
      this.setData({
        selectedColor: color
      });
    },
    onClose() {
      this.triggerEvent('close');
    },
    onConfirm() {
      this.triggerEvent('save', {
        icon: this.data.selectedIcon,
        color: this.data.selectedColor
      });
    },
  }
})
