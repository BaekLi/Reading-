const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({

      /**
       * 页面的初始数据
       */
      data: {
            ids: -1,
            // phone: '',
            wxnum: '',
            qqnum: '',
            email: '',
            campus: JSON.parse(config.data).campus,
      },
      choose(e) {
            let that = this;
            that.setData({
                  ids: e.detail.value
            })
            //下面这种办法无法修改页面数据
            /* this.data.ids = e.detail.value;*/
      },
      onLoad() {
            this.getdetail();
      },
      getdetail() {
            let that = this;
            db.collection('user').where({
                  _openid: app.openid
            }).get({
                  success: function(res) {
                        let info = res.data[0];
                        that.setData({
                              // phone: info.phone,
                              qqnum: info.qqnum,
                              wxnum: info.wxnum,
                              email: info.email,
                              ids: info.campus.id,
                              _id: info._id
                        })
                  },
                  fail() {
                        wx.showToast({
                              title: '获取失败',
                              icon: 'none'
                        })
                        let e = setTimeout(
                              wx.navigateBack({}), 2000
                        )
                  }
            })
      },
      //学号获取
      xhInput(e) {
        this.data.xhnum = e.detail.value;
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
                        title: '请先获取您的校区',
                        icon: 'none',
                        duration: 2000
                  });
            }
            //校检手机号
            let xhnum = that.data.xhnum;
            if (!(/^\s*[.0-9]{11}\s*$/.test(xhnum))) {
              wx.showToast({
                title: '请输入正确手机号',
                icon: 'none',
                duration: 2000
              });
              return false;
            }
            //校检专业
            // let zyname = that.data.zyname;
            // if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(zyname))) {
            //   wx.showToast({
            //     title: '请输入正确专业名称',
            //     icon: 'none',
            //     duration: 2000
            //   });
            //   return false;
            // }
            wx.showLoading({
                  title: '正在提交',
            })
            db.collection('user').doc(that.data._id).update({
                  data: {
                        campus: that.data.campus[that.data.ids],
                        phone: that.data.wxnum,
                        childname:that.data.zyname,
                        info: that.data.userInfo,
                        updatedat: new Date().getTime(),
                  },
                  success: function(res) {
                        console.log(res)
                        db.collection('user').doc(that.data._id).get({
                              success: function(res) {
                                    app.userinfo = res.data;
                                    app.openid = res.data._openid;
                                    wx.hideLoading();
                                    wx.showToast({
                                          title: '修改成功',
                                          icon: 'success'
                                    })
                              },
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
