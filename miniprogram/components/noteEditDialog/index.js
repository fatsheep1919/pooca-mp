// components/noteEditDialog/index.js
const db = wx.cloud.database();

const defaultData = {
  itemId: '',
  itemInfo: {
    id: '',
    name: '',
    icon: {
      name: '',
      color: '',
    },
  },
  text: '',
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    note: {
      type: Object,
      observer: function(val) {
        if (val) {
          this.setData({
            id: val._id,
            itemId: val.itemId,
            itemInfo: val.itemInfo,
            text: val.text
          });
        } else {
          this.setData({
            ...JSON.parse(JSON.stringify(defaultData))
          })
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    id: null,
    ...JSON.parse(JSON.stringify(defaultData)),
    windowHeight: 0,
    marginTop: 'auto',
  },

  ready() {
    const self = this;
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateText(e) {
      const text = e.detail.value;
      this.setData({ text })
    },
    onSave() {
      const self = this;
      const { id, itemId, itemInfo, text } = self.data;
      if (!id) {
        db.collection('note').add({
          data: {
            itemId,
            itemInfo,
            text,
            tags: [],
            created: new Date().getTime(),
          }
        })
          .then(res => {
            self.setData({
              ...JSON.parse(JSON.stringify(defaultData)),
            })
            self.triggerEvent('save');
          })
          .catch(error => {
            wx.showToast({
              title: '保存失败，请稍后重试',
            });
          });
      } else {
        db.collection('note').doc(id).update({
          data: {
            text,
            tags: [],
          },
          success: function(res) {
            self.setData({
              ...JSON.parse(JSON.stringify(defaultData)),
            })
            self.triggerEvent('save', { noteId: id });
          },
          fail: function(error) {
            wx.showToast({
              title: '保存失败，请稍后重试',
            });
          },
        })
      }
    },
    onClose() {
      this.triggerEvent('close');
    },
    updateDialogPosition(res) {
      if (res.detail.height == 0) {
        this.setData({
          marginTop: 'auto'
        });
      } else if (this.data.windowHeight > 0) {
        const inputHeight = 120;
        let marginTop = this.data.windowHeight - res.detail.height - inputHeight;
        this.setData({
          marginTop: `${marginTop}px`,
        });
      }
    },
  }
})
