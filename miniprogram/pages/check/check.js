// miniprogram/pages/check/check.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    checkDay:[],
    check:0
  },

  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let that = this;
    let dateArr = [];                       //需要遍历的日历数组数据
    let arrLen = 0;                         //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();                 //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay();                          //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();               //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    //console.log(startWeek);
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          weight: 5,
          isChecked:0
        }
        for(var d=0;d<that.data.checkDay.length;d++){
          if(obj.isToday==that.data.checkDay[d].day){
            obj.isChecked=1;
            break;
          }
        }
      } else {
        obj = {
          isChecked:0
        };
      }
      dateArr[i] = obj;
    }
    that.setData({
      dateArr: dateArr
    });
    //console.log(dateArr);
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      that.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      that.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  /**
   * 上月切换
   */
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
    //console.log(this.data.dateArr);
  },
  /**
   * 下月切换
   */
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
    //console.log(this.data.dateArr);
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
    let that = this;
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;

    that.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate()
    });
    //console.log(that.data.dateArr);
    db.collection('calendar').where({
      _openid: app.openid
    }).get({
      success:function(res){
        //console.log(res);
        let info = res.data[0];
        that.setData({
          checkDay:info.checkDay
        });
        that.dateInit();
        that.judge();
      },
      fail(){
        db.collection('calendar').add({
          data:{
            checkDay:[]
          }
        });
        that.dateInit();
        that.judge();
      }
    });
  },

  //判断是否签到
  judge:function(){
    var that = this;
    for(var j=0;j<that.data.checkDay.length;j++){
      if(that.data.checkDay[j].day==that.data.isToday){
        that.setData({
          check:1
        });
        break;
      }
    }
  },

  //今日打卡
  daka:function(){
    var that = this;
    let today = that.data.isToday;
    var obj={};
    obj.day = today;
    for(var j=0;j<that.data.checkDay.length;j++){
      if(that.data.checkDay[j].day==today){
        wx.showToast({
          title: '今日已打卡',
          icon: 'none'
        });
        return;
      }
    }
    db.collection('calendar').where({
      _openid:app.openid
    }).get({
      success:function(res){
        //console.log(123);
        let info = res.data[0];
        let checkDay = info.checkDay;
        checkDay.push(obj);
        db.collection('calendar').doc(info._id).update({
          data:{
            checkDay:checkDay
          }
        });
        that.setData({
          checkDay:checkDay,
        });
        that.dateInit();
        wx.showToast({
          title: '完成打卡',
          icon: 'success'
        });
        
      },
      fail(){
        //console.log(258);
        db.collection('calendar').add({
          data:{
            checkDay:[]
          }
        })
      }
    });

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
