// miniprogram/pages/cepin/cepin.js
const db = wx.cloud.database();
const app = getApp();
const $v = app.globalData.questionInfo;
var choose = new Array(73);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    question:{},
    choose:{},
    ansvalue:[
      {"value":1},
      {"value":2},
      {"value":3},
      {"value":4},
      {"value":5},
    ],
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
    var _m = "question";
    var that = this;
    that.setData({
      [_m]:$v
    });
    db.collection('questionnaire').where({
      _openid:app.openid
    }).get({
      success:function(res){
        let info = res.data[0];
        that.setData({
          choose:info.chooseNumber
        });
        console.log(that.data.choose);
      }
    })
  },

  radioChange:function(e){
    choose[e.currentTarget.dataset.value] = parseInt(e.detail.value);
    console.log(choose[e.currentTarget.dataset.value]);
  },

  submitChoose:function(e){
    var i;
    for(i=1;i<73;i++){
      if(choose[i]==null){
        wx.showToast({
        title: '请将问卷填写完整！',
        icon:"none",
        duration:2000
      });
      break;
      }
    }
    if(i==73){
      wx.showModal({
        title: '温馨提示',
        content: '您是否确定要提交问卷？',
        success(res) {
              if (res.confirm) {
                    var yan=0,shu=0,shi=0,dong=0,yinyue=0,jiaoliu=0,zizhi=0,guan=0,cunzai=0;
                    for(var j=1;j<73;j++){
                      if(j==2||j==12||j==29||j==31||j==33||j==51||j==64||j==69){
                        yan+=choose[j];
                      }
                      else if(j==5||j==8||j==20||j==21||j==26||j==45||j==50||j==63){
                        shu+=choose[j];
                      }
                      else if(j==3||j==19||j==24||j==35||j==39||j==49||j==66||j==67){
                        shi+=choose[j];
                      }
                      else if(j==1||j==14||j==23||j==25||j==28||j==54||j==62||j==68){
                        dong+=choose[j];
                      }
                      else if(j==13||j==16||j==18||j==30||j==42||j==46||j==55||j==56){
                        yinyue+=choose[j];
                      }
                      else if(j==6||j==7||j==22||j==32||j==36||j==57||j==58||j==61){
                        jiaoliu+=choose[j];
                      }
                      else if(j==4||j==9||j==15||j==40||j==41||j==47||j==53||j==71){
                        zizhi+=choose[j];
                      }
                      else if(j==10||j==17||j==37||j==38||j==43||j==48||j==60||j==70){
                        guan+=choose[j];
                      }
                      else if(j==11||j==27||j==34||j==44||j==52||j==59||j==65||j==72){
                        cunzai+=choose[j];
                      }
                    }
                    wx.showLoading({
                      title: '正在提交',
                    });
                    db.collection('questionnaire').where({
                      _openid:app.openid
                    }).get({
                      success:function(res){
                        let info = res.data[0];
                        db.collection('questionnaire').doc(info._id).update({
                          data:{
                            chooseNumber:choose,
                            yanyu:yan,
                            shuxue:shu,
                            shijue:shi,
                            dongjue:dong,
                            yinyue:yinyue,
                            jiaowang:jiaoliu,
                            zixing:zizhi,
                            guancha:guan,
                            cunzai:cunzai,
                            date:new Date().getTime(),
                          },
                          success: function(res) {
                            wx.hideLoading();
                            wx.showToast({
                                  title: '提交成功',
                                  icon: 'success'
                            });
                            wx.navigateTo({
                              url: 'package1/pages/repo/repo',
                            })
                          },
                          fail(){
                            wx.hideLoading();
                            wx.showToast({
                                  title: '提交失败，请重新提交',
                                  icon: 'none',
                            })
                          }
                        })
                      },
                      fail(){
                        db.collection('questionnaire').add({
                          data:{
                            chooseNumber:choose,
                            yanyu:yan,
                            shuxue:shu,
                            shijue:shi,
                            dongjue:dong,
                            yinyue:yinyue,
                            jiaowang:jiaoliu,
                            zixing:zizhi,
                            guancha:guan,
                            cunzai:cunzai,
                            date:new Date().getTime(),
                          },
                          success: function(res) {
                            wx.hideLoading();
                            wx.showToast({
                                  title: '提交成功',
                                  icon: 'success'
                            });
                            wx.navigateTo({
                              url: 'package1/pages/repo/repo',
                            })
                          },
                          fail(){
                            wx.hideLoading();
                            wx.showToast({
                                  title: '提交失败，请重新提交',
                                  icon: 'none',
                            })
                          }
                        });
                      }
                    });
              }
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
