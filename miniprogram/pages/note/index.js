// pages/note/index.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rawData: [],
    entryList: [],
  
    showEditDialog: false,
    curNote: null,
  },

  loadEntries() {
    const self = this;
    db.collection('item').where({ closed: false }).get({
      success: function(res) {
        const rawData = res?.data || [];
        let total = rawData.length;
        let groupSize = 2;
        if (total > 8) { groupSize = 3; }
        if (total > 12) { groupSize = 4; }

        let formatData = [];
        for (let i=0; i<total; i++) {
          let row = Math.floor(i / groupSize);
          if (!formatData[row]) {
            formatData[row] = [];
          }
    
          formatData[row].push({
            ...rawData[i],
            rawIndex: i,
          });
        }

        if (total > 1 && total % groupSize > 0) {
          let tailCount = groupSize - total % groupSize;
          for (let i=0; i<tailCount; i++) {
            formatData[formatData.length - 1].push({})
          }
        }

        self.setData({
          rawData,
          entryList: formatData,
        });
      },
    });
  },

  editNote(e) {
    const self = this;
    const rawIndex = e.currentTarget.dataset['index'];
    const item = self.data.rawData[rawIndex];
    self.setData({
      showEditDialog: true,
      curNote: {
        itemId: item._id,
        itemInfo: item,
        text: '',
      },
    });
  },

  closeDialog() {
    this.setData({
      showEditDialog: false,
      curNote: null,
    });
  },

  jumpToToday() {
    this.closeDialog();
    wx.switchTab({
      url: '/pages/today/index',
    })
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
    this.loadEntries();
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