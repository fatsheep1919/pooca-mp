// pages/item/timeline/index.js
// const db = wx.cloud.database();
import { db } from '../../../db/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemId: null,
    itemCreated: 0,

    startTime: 0,
    endTime: 0,
    dataList: [],
    loading: false,
    allLoaded: false,
  },

  formatDate(created) {
    const date = new Date(created);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const mStr = m < 10 ? `0${m}` : m;
    const d = date.getDate();
    const dStr = d < 10 ? `0${d}` : d;
    return `${y}-${mStr}-${dStr}`;
  },

  formatCreatedTime(created) {
    const date = new Date(created);
    const h = date.getHours();
    const hStr = h < 10 ? `0${h}` : h;
    const m = date.getMinutes();
    const mStr = m < 10 ? `0${m}` : m;
    return `${hStr}:${mStr}`;
  },

  formatDataList(rawData) {
    const self = this;

    const dataMap = {}; // date: noteList
    rawData.forEach(it => {
      const date = self.formatDate(it.created);
      if (!dataMap[date]) {
        dataMap[date] = [];
      }
      dataMap[date].push({
        ...it,
        text: it.text.replaceAll('\n', '\r\n'),
        createdTime: it.created ? self.formatCreatedTime(it.created) : '',
      });
    });

    const formatList = [];
    Object.keys(dataMap).forEach(date => {
      formatList.push({
        date,
        noteList: dataMap[date],
      });
    });

    console.log('formatList:', formatList)
    return formatList;
  },

  loadInitialData() {
    const startTime = this.data.itemCreated;
    const endTime = startTime + (10 * 24 * 3600000); // 10天
    console.log('time range:', startTime, endTime)
    this.loadData(startTime, endTime);
  },

  loadMoreData() {
    const startTime = this.data.endTime;
    const endTime = startTime + (10 * 24 * 3600000); // 10天
    this.loadData(startTime, endTime);
  },

  loadData(startTime, endTime) {
    const self = this;
    if (self.data.allLoaded || self.data.loading) {
      return;
    }

    self.setData({ loading: true });
    const _ = db.command;
    db.collection('note').where({
      itemId: _.eq(self.data.itemId),
      created: _.gte(startTime).and(_.lt(endTime))
    }).get({
      success: function(res) {
        console.log('load data:', res)
        const newDataList = self.formatDataList(res.data);
        self.setData({
          startTime,
          endTime,
          dataList: self.data.dataList.length > 0 ? [...self.data.dataList, ...newDataList] : newDataList,
          loading: false,
          allLoaded: res.data.length == 0,
        })
      },
      fail: function(error) {
        console.log('load data error:', error)
      },
    });
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
    this.loadInitialData();
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