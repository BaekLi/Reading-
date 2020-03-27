const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({

      /**
       * 页面的初始数据
       */
      data: {
            ids: -1,
            idd: -1,
            // phone: '',
            wxnum: '',
            qqnum: '',
            email: '',
            campus: JSON.parse(config.data).campus,
            relationship:JSON.parse(config.data).relationship
      },
      
      choose(e) {
            let that = this;
            that.setData({
                  ids: e.detail.value,
            })
            //下面这种办法无法修改页面数据
            /* this.data.ids = e.detail.value;*/
      },
      // choosee(e) {
      //       let that = this;
      //       that.setData({
      //             idd: e.detail.value,
      //       })
      //       //下面这种办法无法修改页面数据
      //       /* this.data.ids = e.detail.value;*/
      // },
      //手机号获取
      xhInput(e){
        this.data.xhnum=e.detail.value;
      },
      //名字获取
      zyInput(e) {
        this.data.zyname = e.detail.value;
      },
      getUserInfo(e) {
            let that = this;
            console.log(e);
            let test = e.detail.errMsg.indexOf("ok");
            if (test == '-1') {
                  wx.showToast({
                        title: '请授权后方可使用',
                        icon: 'none',
                        duration: 2000
                  });
            } else {
                  that.setData({
                        userInfo: e.detail.userInfo
                  })
                  that.check();
            }
      },
      //校检
      check() {
            let that = this;
            //校检校区
            let ids = that.data.ids;
            let campus = that.data.campus;
            if (ids == -1) {
                  wx.showToast({
                        title: '请先获取您孩子的年级',
                        icon: 'none',
                        duration: 2000
                  });
            }
            // let idd=that.data.idd;
            // let rela = that.data.relationship;
            // if (idd == -1) {
            //       wx.showToast({
            //             title: '请先获取您和孩子的关系',
            //             icon: 'none',
            //             duration: 2000
            //       });
            // }
            //校检手机号
            let xhnum=that.data.xhnum;
            if (!(/^\s*[.0-9]{11}\s*$/.test(xhnum))) {
              wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 2000
              });
              return false;
            }
            //校检名字
            let zyname = that.data.zyname;
            if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(zyname))) {
              wx.showToast({
                title: '请输入正确的名字',
                icon: 'none',
                duration: 2000
              });
              return false;
            }
            wx.showLoading({
                  title: '正在提交',
            })
            db.collection('user').add({
                  data: {
                        campus: that.data.campus[that.data.ids],
                        //relationship:that.data.rela[that.data.idd],
                        phone: that.data.xhnum,
                        childname:that.data.zyname,
                        stamp: new Date().getTime(),
                        info: that.data.userInfo,
                        useful: true,
                        parse: 0,
                  },
                  success: function(res) {
                        console.log(res)
                        db.collection('user').doc(res._id).get({
                              success: function(res) {
                                    app.userinfo = res.data;
                                    app.openid = res.data._openid;
                                    wx.navigateBack({})
                              },
                        });
                        db.collection('calendar').add({
                              data:{
                                checkDay:[]
                              }
                        });
                        db.collection('questionnaire').add({
                              data:{
                                    
                              }
                        })
                  },
                  fail() {
                        wx.hideLoading();
                        wx.showToast({
                              title: '注册失败，请重新提交',
                              icon: 'none',
                        })
                  }
            })
      },
})
