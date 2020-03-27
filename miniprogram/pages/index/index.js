//index.js
const db = wx.cloud.database();
var app = getApp();
var util = require('../../utils/util.js');
Page({
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getuserdetail();
    },

    //为了数据安全可靠，每次进入获取一次用户信息
    getuserdetail() {
        if (!app.openid) {
              wx.cloud.callFunction({
                    name: 'regist', // 对应云函数名
                    data: {
                          $url: "getid", //云函数路由参数
                    },
                    success: re => {
                          db.collection('user').where({
                                _openid: re.result
                          }).get({
                                success: function (res) {
                                      if (res.data.length !== 0) {
                                            app.openid = re.result;
                                            app.userinfo = res.data[0];
                                            console.log(app)
                                      }
                                      console.log(res)
                                }
                          })
                    }
              })
        }
  },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
