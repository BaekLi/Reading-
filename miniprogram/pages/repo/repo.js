// miniprogram/pages/repo/repo.js
const db = wx.cloud.database();
const app = getApp();
var numCount=9; //元素个数
var numSlot=5; //一条线上的总结点数
var mW=400;   //Canvas的宽度
var mCenter=mW/2; //中心点
var mAngle=Math.PI*2/numCount;  //角度
var mRadius=mCenter-95;  //半径
var radCtx = wx.createCanvasContext('radarCanvas');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseNumber:[],
    zhineng:[],
    std:["差","较差","一般","较好","优良"],
    zn:[],
    yanyu:0,
    shuxue:0,
    shijue:0,
    dongjue:0,
    yinyue:0,
    jiaowang:0,
    zixing:0,
    guancha:0,
    cunzai:0,
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
    console.log(app.openid);
    let that = this;
    db.collection('questionnaire').where({
      _openid:app.openid
    }).get({
      success:function(res){
        let info = res.data[0];
        console.log(info);
        that.setData({
          chooseNumber: info.chooseNumber,
          zhineng:[info.yanyu,info.shuxue,info.shijue,info.dongjue,info.yinyue,info.jiaowang,info.zixing,info.guancha,info.cunzai],
          yanyu:info.yanyu,
          shuxue:info.shuxue,
          shijue:info.shijue,
          dongjue:info.dongjue,
          yinyue:info.yinyue,
          jiaowang:info.jiaowang,
          zixing:info.zixing,
          guancha:info.guancha,
          cunzai:info.cunzai
        });
        console.log(that.data.zhineng);
        that.drawRadar();
        that.onJudge();
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
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  //判断标准
  onJudge:function(){
    var zn = this.data.zn;
    var std = this.data.std;
    for(var i=0;i<9;i++){
      var v = this.data.zhineng[i];
      if(v<=12){
        zn[i]=std[0];
      }else if(v<=20){
        zn[i]=std[1];
      }else if(v<=28){
        zn[i]=std[2];
      }else if(v<=36){
        zn[i]=std[3];
      }else{
        zn[i]=std[4];
      }
      console.log(v+":"+zn[i]);
    }
    this.setData({
      zn:zn
    });
  },

  //雷达图
  drawRadar:function(){
    var score = this.data;
    var sourceData = [["言语",score.yanyu],["逻辑数学",score.shuxue],["视觉空间",score.shijue],["身体动觉",score.dongjue],["音乐节奏",score.yinyue],["交往交流",score.jiaowang],["自知自省",score.zixing],["自然观察",score.guancha],["存在",score.cunzai]];
    this.drawEdge();  //画九边型
    this.drawLinePoint();
    this.drawRegion(sourceData,'rgba(0, 150, 0, 0.5)'); //设置数据
    this.drawTextCans(sourceData);  //设置文本数据
    this.drawCircle(sourceData,'green');  //设置结点
    radCtx.draw();  //开始绘制
  },
  //绘制9条边
  drawEdge:function(){
    radCtx.setStrokeStyle("grey");
    radCtx.setLineWidth(2);   //设置线宽
    for(var i=0;i<numSlot;i++){
      //计算半径
      radCtx.beginPath();
      var rdius = mRadius/numSlot*(i+1);
      //画9条线段
      for(var j=0;j<numCount;j++){
        //坐标
        var x = mCenter+ rdius* Math.cos(mAngle*j);
        var y = mCenter+ rdius* Math.sin(mAngle*j);
        radCtx.lineTo(x, y);
      }
      radCtx.closePath();
      radCtx.stroke();
    }
  },
  // 绘制连接点
  drawLinePoint:function(){
    radCtx.beginPath();
    for (var k = 0; k < numCount; k++) {
      var x = mCenter + mRadius * Math.cos(mAngle * k);
      var y = mCenter + mRadius * Math.sin(mAngle * k);

      radCtx.moveTo(mCenter, mCenter);
      radCtx.lineTo(x, y);
    }
    radCtx.stroke();
  },
  //绘制数据区域(数据和填充颜色)
  drawRegion: function (mData,color){
      
      radCtx.beginPath();
      for (var m = 0; m < numCount; m++){
      var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m][1] / 40;
      var y = mCenter + mRadius * Math.sin(mAngle * m) * mData[m][1] / 40;

      radCtx.lineTo(x, y);
      }
      radCtx.closePath();
      radCtx.setFillStyle(color)
      radCtx.fill();
    },

    //绘制文字
    drawTextCans: function (mData){

      radCtx.setFillStyle("black")
      radCtx.font = 'bold 16px cursive'  //设置字体
      for (var n = 0; n < numCount; n++) {
        var x = mCenter + mRadius * Math.cos(mAngle * n);
        var y = mCenter + mRadius * Math.sin(mAngle * n);
        // radCtx.fillText(mData[n][0], x, y);
        //通过不同的位置，调整文本的显示位置
        if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
          radCtx.fillText(mData[n][0], x+5, y+5);
        } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
          radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-7, y+5);
        } else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
          radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-5, y);
        } else {
          radCtx.fillText(mData[n][0], x+7, y+2);
        }

      }
    },
    //画点
    drawCircle: function(mData,color){
       var r = 3; //设置节点小圆点的半径
       for(var i = 0; i<numCount; i ++){
          var x = mCenter + mRadius * Math.cos(mAngle * i) * mData[i][1] / 40;
          var y = mCenter + mRadius * Math.sin(mAngle * i) * mData[i][1] / 40;

          radCtx.beginPath();
          radCtx.arc(x, y, r, 0, Math.PI * 2);
          radCtx.fillStyle = color;
          radCtx.fill();
        }

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
