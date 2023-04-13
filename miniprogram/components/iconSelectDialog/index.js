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
        const { previewIcon } = this.data;
        previewIcon.name = val;
        this.setData({
          previewIcon
        });
      }
    },
    color: {
      type: String,
      observer: function(val) {
        const { previewIcon } = this.data;
        previewIcon.color = val;
        this.setData({
          previewIcon
        });
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    icons: [
      ['gym', 'diary', 'money', 'poo', 'word'],
      ['gitar', 'movie', 'beer', 'coffee', 'pill'],
    ],
    colors: [
      ['#ffc0cb', '#ffff00', '#ffa500', '#a2f4ff', '#b9b8ff'],
      ['#b8ffcf', '#ffdcb8', '#b8d4ff', '#eeb8ff', '#fbffb8'],
    ],

    iconType: 'img',
    altInput: '',

    previewIcon: {
      name: null,
      color: null,
      alt: '',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateIconType(e) {
      const iconType = e.detail.value;
      const { previewIcon } = this.data;
      previewIcon.name = null;
      previewIcon.alt = '';
      this.setData({ iconType, previewIcon, altInput: '' });
    },
    updateIcon(e) {
      const icon = e.currentTarget.dataset['icon'];
      const { previewIcon } = this.data;
      previewIcon.name = icon;
      this.setData({
        previewIcon
      });
    },
    updateAlt(e) {
      const alt = e.detail.value;
      const { previewIcon } = this.data;
      previewIcon.name = null;
      previewIcon.alt = (alt || '').substring(0, 2);
      this.setData({
        previewIcon
      });
    },
    updateColor(e) {
      const color = e.currentTarget.dataset['color'];
      const { previewIcon } = this.data;
      previewIcon.color = color;
      this.setData({
        previewIcon
      });
    },
    onClose() {
      this.triggerEvent('close');
    },
    onConfirm() {
      this.triggerEvent('save', this.data.previewIcon);
    },
  }
})
