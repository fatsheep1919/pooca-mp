// pages/today/index.js
const db = wx.cloud.database();

const slideButtons = [{
  type: 'warn',
  text: '警示',
  extClass: 'today-item-icon',
  src: '/images/remove.png'
}];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formatYear: '',
    formatDate: '',
    noteList: [],

    curNote: null,
    showEditDialog: false,

    loaded: false,
  },

  getTimeRange(date) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    
    const startDate = new Date(y, m, d);
    const endDate = new Date(startDate.getTime() + 24 * 3600 * 1000);
  
    return [startDate.getTime(), endDate.getTime()];
  },

  formatCreatedTime(created) {
    const date = new Date(created);
    const h = date.getHours();
    const hStr = h < 10 ? `0${h}` : h;
    const m = date.getMinutes();
    const mStr = m < 10 ? `0${m}` : m;
    return `${hStr}:${mStr}`;
  },

  updateDate(date) {
    const self = this;
    if (date) {
      let year = date.getFullYear();
      let m = date.getMonth() + 1;
      let mStr = m < 10 ? `0${m}` : m;
      let d = date.getDate();
      let dStr = d < 10 ? `0${d}` : d;
      
      self.setData({
        formatYear: `${year}-`,
        formatDate: `${mStr}-${dStr}`
      })
    }
  },

  loadNotes(date) {
    const self = this;
    const [startTime, endTime] = self.getTimeRange(date);

    const _ = db.command;
    db.collection('note').where({
      created: _.gte(startTime).and(_.lt(endTime))
    }).get({
      success: function(res) {
        self.updateDate(date);
        self.setData({
          noteList: res?.data?.map(it => ({
            ...it,
            text: it.text.replaceAll('\n', '\r\n'),
            createdDate: it.created ? self.formatCreatedTime(it.created) : '',
            buttons: slideButtons.map(btn => ({
              ...btn,
              data: it._id
            }))
          })),
          loaded: true
        })
      }
    });
  },

  editNote(e) {
    const note = e.currentTarget.dataset['note'];
    this.setData({
      curNote: note,
      showEditDialog: true
    });
  },

  updateNote(e) {
    const { noteId } = e.detail;
    const self = this;
    if (noteId) {
      const { noteList } = self.data;
      const index = noteList.findIndex(it => it._id == noteId);
      if (index >= 0) {
        const target = noteList[index];
        db.collection('note').doc(noteId).get({
          success: function(res) {
            target.text = res.data.text;
            noteList.splice(index, 1, target);
            self.setData({
              noteList: [...noteList],
              curNote: null,
              showEditDialog: false
            });
          },
        })
      }
    }
  },

  closeDialog() {
    this.setData({
      curNote: null,
      showEditDialog: false
    });
  },

  onSlideButtonTap(e) {
    const { data } = e.detail;
    const self = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除这条记录吗?',
      success (res) {
        if (res.confirm) {
          db.collection('note').doc(data).remove({
            success: function() {
              wx.showToast({
                title: '删除成功',
              });
              
              const { noteList } = self.data;
              const index = noteList.findIndex(it => it._id == data);
              if (index >= 0) {
                noteList.splice(index, 1);
                self.setData({
                  noteList: [...noteList],
                });
              }
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
    this.loadNotes(new Date());
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.setData({ loaded: false });
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