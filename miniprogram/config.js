var data = {
      //云开发环境id
      env: 'reading-gufoo',
      //分享配置
      share_title: 'reading+幼儿核心素养孵化平台',
      share_img: '/images/poster.jpg', //可以是网络地址，本地文件路径要填绝对位置
  share_poster:'https://s2.ax1x.com/2020/02/20/3edjNd.png',//必须为网络地址
      //客服联系方式
      kefu: {
            qq: '953286764',
      },
      //默认启动页背景图，防止请求失败完全空白 
      //可以是网络地址，本地文件路径要填绝对位置
      bgurl: '/images/startBg.jpg',
      //关系
      // relationship:[
      //       {
      //             guanxi:'母亲',
      //             id:0
      //       },
      //       {
      //             guanxi:'父亲',
      //             id:1
      //       },
      //       {
      //             guanxi:'其他',
      //             id:2
      //       }
      // ],
      //校区
      campus: [{
                  name: '大班',
                  id: 0
            },
            {
                  name: '中班',
                  id: 1
            },
            {
                  name: '小班',
                  id: 2
            },
      ],
}
//下面的就别动了
function formTime(creatTime) {
      let date = new Date(creatTime),
            Y = date.getFullYear(),
            M = date.getMonth() + 1,
            D = date.getDate(),
            H = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
      if (M < 10) {
            M = '0' + M;
      }
      if (D < 10) {
            D = '0' + D;
      }
      if (H < 10) {
            H = '0' + H;
      }
      if (m < 10) {
            m = '0' + m;
      }
      if (s < 10) {
            s = '0' + s;
      }
      return Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s;
}

function days() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      if (month < 10) {
            month = '0' + month;
      }
      if (day < 10) {
            day = '0' + day;
      }
      let date = year + "" + month + day;
      return date;
}
module.exports = {
      data: JSON.stringify(data),
      formTime: formTime,
      days: days
}