// pages/item/calendar/index.js
// const db = wx.cloud.database();
import { db } from '../../../db/index.js';
import { formatTime } from '../../../util/util';

const calendarHead = [
  '日', '一', '二', '三', '四', '五', '六',
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendarHead, 
  
    itemId: null,
    itemCreated: 0,
  
    year: 0,
    month: 0,
    calendarItems: [],
    loading: false,

    selected: null,
  },

  getMonthRange(year, month) {
    let lastDay = 31;
    if (month < 11) {
      lastDay = new Date(year, month+1, 0).getDate();
    }

    const startTime = new Date(year, month, 1).getTime();
    const endTime = new Date(year, month, lastDay + 1).getTime();

    return [startTime, endTime];
  },

  formatCalendarData(year, month, rawData) {
    let dayCount = 31;
    if (month < 11) {
      dayCount = new Date(year, month+1, 0).getDate();
    }

    const calendarData = [];
    const firstDay = new Date(year, month, 1).getDay();
    for (let i=0; i<firstDay; i++) {
      calendarData.push({});
    }

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    for (let i=1; i<=dayCount; i++) {
      calendarData.push({
        day: i,
        noteList: rawData.filter(it => 
          new Date(it.created).getDate() == i
        ),
        past: new Date(year, month, i) - startOfToday < 0
      });
    }

    return calendarData;
  },

  loadPrevMonthData() {
    const { year, month } = this.data;
    if (month == 0) {
      this.loadData(year - 1, 11);
    } else {
      this.loadData(year, month - 1);
    }
  },

  loadNextMonthData() {
    const { year, month } = this.data;
    if (month == 11) {
      this.loadData(year + 1, 0);
    } else {
      this.loadData(year, month + 1);
    }
  },

  loadData(year, month) {
    const self = this;
    const [startTime, endTime] = self.getMonthRange(year, month);

    self.setData({ loading: true });
    const _ = db.command;
    db.collection('note').where({
      itemId: _.eq(self.data.itemId),
      created: _.gte(startTime).and(_.lt(endTime))
    }).get({
      success: function(res) {
        console.log('load data:', res)
        const newCalendarItems = self.formatCalendarData(year, month, res.data);
        self.setData({
          year,
          month,
          monthStr: `${year}-${month}`,
          calendarItems: newCalendarItems,
          loading: false,
          selected: null,
        })
      },
      fail: function(error) {
        console.log('load data error:', error)
      },
    });
  },

  showDetail(e) {
    const self = this;
    const day = e.currentTarget.dataset['day'];
    const index = self.data.calendarItems.findIndex(it => it.day == day)
    if (index >= 0) {
      const target = self.data.calendarItems[index];
      self.setData({
        selected: {
          ...target,
          noteList: target.noteList.map(it => ({
            ...it,
            time: formatTime(it.created)
          }))
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { itemId, created } = options;
    this.setData({
      itemId,
      itemCreated: parseInt(created),
    });
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
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    this.loadData(year, month);
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