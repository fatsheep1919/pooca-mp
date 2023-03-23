// pages/item/index.js
const db = wx.cloud.database();

const slideButtons = [{
  text: '普通',
  src: '/images/edit.png'
}, {
  type: 'warn',
  text: '警示',
  extClass: 'danger',
  src: '/images/remove.png'
}];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: [],
    slideButtonsShown: false,
  },

  onItemTap(e) {
    if (this.data.slideButtonsShown) {
      return;
    }

    const item = e.currentTarget.dataset['item'];
    const { _id, created, view } = item;
    wx.navigateTo({
      url: `${view}/index?itemId=${_id}&created=${created}`,
      success: function(res) {
      },
      fail: function(error) {
        console.log('error:', error)
      }
    });
  },

  loadItems() {
    const self = this;
    db.collection('item')
      .get({
        success: function(res) {
          self.setData({
            itemList: (res?.data || []).map(it => ({
              ...it,
              createdDate: it.created ? new Date(it.created).toLocaleDateString() : '',
              buttons: slideButtons.map(btn => ({
                ...btn,
                data: it._id
              }))
            }))
          })
        }
      })
  },

  createItem() {
    wx.navigateTo({
      url: 'edit/index',
      success: function(res) {
      },
      fail: function(error) {
        console.log('error:', error)
      }
    })
  },

  removeItem(id) {
    if (!id) {
      return;
    }

    const self = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除事项吗?',
      success (res) {
        if (res.confirm) {
          db.collection('item').doc(id).remove({
            success: function() {
              wx.showToast({
                title: '删除成功',
              });
              self.loadItems();
            },
            fail: function(error) {
              wx.showToast({
                title: '删除失败，请稍后重试',
              });
            },
          })
        } else if (res.cancel) {}
      }
    });
  },

  onSlideButtonShow() {
    this.setData({ slideButtonsShown: true })
  },

  onSlideButtonHide() {
    const self = this;
    setTimeout(() => {
      self.setData({ slideButtonsShown: false })
    }, 350)
  },

  onSlideButtonTap(e) {
    const self = this;
    self.setData({ slideButtonsShown: false })

    const { index, data } = e.detail;
    if (index == 0) {
      wx.navigateTo({
        url: `edit/index?data=${data}`,
        success: function(res) {
        },
        fail: function(error) {
          console.log('error:', error)
        }
      })

    } else if (index == 1) {
      this.removeItem(data);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.loadItems();
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