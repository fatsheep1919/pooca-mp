// pages/item/create/index.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemId: null,
    editParam: {
      name: '',
      icon: {
        name: '',
        color: '',
        alt: '',
      },
      view: '', // calendar | timeline
      closed: false,
    },

    showIconDialog: false,
  },

  updateName(e) {
    const { editParam } = this.data;
    const name = e.detail.value;
    editParam.name = name?.trim();
    this.setData({ editParam });
  },

  openIconDialog() {
    this.setData({
      showIconDialog: true
    });
  },

  closeIconDialog() {
    this.setData({
      showIconDialog: false
    });
  },

  updateIcon(e) {
    const { name, color, alt } = e.detail;
    this.setData({
      editParam: {
        ...this.data.editParam,
        icon: {
          name,
          color,
          alt,
        }
      },
      showIconDialog: false
    })
  },

  updateView(e) {
    const { editParam } = this.data;
    editParam.view = e.detail.value;
    this.setData({ editParam });
  },

  updateStatus(e) {
    const { editParam } = this.data;
    editParam.closed = e.detail.value;
    this.setData({ editParam });
  },

  createItem() {
    const self = this;
    const { editParam } = self.data;
    if (!editParam?.name) {
      wx.showToast({
        title: '名称不能为空',
      });
      return;
    }

    db.collection('item').add({
      data: {
        ...self.data.editParam,
        created: new Date().getTime()
      }
    })
      .then(res => {
        self.goBack();
      })
      .catch(error => {
        wx.showToast({
          title: '创建失败，请稍后重试',
        });
      });
  },

  updateItem() {
    const self = this;
    const { itemId } = self.data;
    if (!itemId) {
      return;
    }
    
    db.collection('item').doc(itemId).update({
      data: {
        ...self.data.editParam
      },
      success: function(res) {
        self.goBack();
      },
      fail: function(error) {
        wx.showToast({
          title: '保存失败，请稍后重试',
        });
      },
    })
  },

  goBack() {
    wx.navigateBack({
      success: function(res) {
      },
      fail: function(error) {
        console.log('navigate error:', error)
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { data } = options;
    const self = this;
    if (!data) {
      const { editParam } = self.data;
      self.setData({
        editParam: {
          ...editParam,
          view: 'calendar'
        }
      })
    } else {
      self.setData({ itemId: data });
      db.collection('item').doc(data).get({
        success: function(res) {
          const { data } = res || {};
          if (data) {
            self.setData({
              editParam: {
                name: data.name,
                icon: {
                  name: data.icon?.name,
                  color: data.icon?.color,
                },
                view: data.view,
                closed: data.closed,
              },
            });
          }
        },
        fail: function(error) {
          wx.showToast({
            title: '加载事项失败，请退出重试',
          });
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})