// miniprogram/pages/task/task.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Q1:'',
    Q2:'',
    Q3:'',
    Q4:'',
    Q5:'',
    q1:'',
    q2:'',
    q3:'',
    q4:'',
    q5:'',
    attr:['yanyu','shuxue','shijue','dongjue','yinyue','jiaoliu','zizhi','guancha','cunzai'],
    select: [false,false,false,false,false]
  },

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


  bindShowMsg(e) {
    let num = e.currentTarget.dataset.value;
    let that = this;
    var select = that.data.select;
    select[num]=!select[num];
      this.setData({
          select:select
      })
  },

  //获得任务
  getTask:function(){
    let that = this;
    db.collection('questionnaire').where({
      _openid:app.openid
    }).get({
      success:function(res){
        let info = res.data[0];
        that.setData({
          zhineng:[info.yanyu,info.shuxue,info.shijue,info.dongjue,info.yinyue,info.jiaowang,info.zixing,info.guancha,info.cunzai]
        });
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

        db.collection('book').where({
          attribute:that.data.attribute
        }).get({
          success:function(res){
            let mes = res.data[0];
            that.setData({
              Q1:mes.Q1,
              Q2:mes.Q2,
              Q3:mes.Q3,
              Q4:mes.Q4,
              Q5:mes.Q5,
              q1:mes.q1,
              q2:mes.q2,
              q3:mes.q3,
              q4:mes.q4,
              q5:mes.q5
            });
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getTask();
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
