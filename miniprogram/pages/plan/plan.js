// miniprogram/pages/plan/plan.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attr:['yanyu','shuxue','shijue','dongjue','yinyue','jiaoliu','zizhi','guancha','cunzai'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.openid) {
      wx.showModal({
        title: '温馨提示',
        content: '该功能需要注册方可使用，是否马上去注册',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
      return false
    }
    this.getAttribute();
  },

  //获得缺乏的智能属性
  getAttribute:function(){
    let that = this;
    db.collection('questionnaire').where({
      _openid:app.openid
    }).get({
      success:function(res){
        let info = res.data[0];
        console.log(app.openid);
        that.setData({
          zhineng:[info.yanyu,info.shuxue,info.shijue,info.dongjue,info.yinyue,info.jiaowang,info.zixing,info.guancha,info.cunzai]
        });
        console.log(that.data.zhineng);
        var minNum=that.data.zhineng[0];
        var num=0;
        for(var i=1;i<9;i++){
          if(minNum>=that.data.zhineng[i]){
            num=i;
            minNum=that.data.zhineng[i];
          }
        }
        that.setData({
          attribute:that.data.attr[num]
        });
        console.log(num+':'+ minNum +that.data.attribute);
        that.getBook();
      }
    })
  },

  //获得书籍信息
  getBook:function(){
    let that = this;
            db.collection('book').where({
              attribute:that.data.attribute
            }).get({
                  success: function (res) {
                    let info = res.data[0];
                    console.log(info);
                    that.setData({
                          url: info.img,
                          bookname:info.bookname,
                          intro:info.intro
                    });
                    console.log(that.data.url);
                  },
                  fail(){
                  }
            })
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
