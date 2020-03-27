//app.js
const config = require("config.js");
App({
  openid:'',
  userinfo:'',
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'reading-gufoo',
        traceUser: true,
      })
    }

    this.systeminfo=wx.getSystemInfoSync();

    this.globalData = {
      questionInfo:{"paper":{"title":"3-7岁幼儿多元智能家长评定问卷","introduction":"家长您好!这份问卷的目的是为了了解您孩子智力的表现差异，请根据他(她)的一贯智力行为表现，选择您认为适合您孩子的选项程度。希望您如实、客观填写，回答无好坏、对错之分。谢谢合作！","biaozhun":"1=不符合，2=不太符合，3=不确定，4=基本符合，5=完全符合。"},"qstList":[{"question":"喜欢手工活动并显示出很强的技巧性"},{"question":"喜欢阅读故事书"},{"question":"对色彩很敏感"},{"question":"喜欢打破砂锅问到底"},{"question":"能从三种相似图案中找出区别"},{"question":"很多小朋友都喜欢和他(她)玩耍"},{"question":"能和其他小朋友打成一片"},{"question":"能排除大小、颜色和位置等因素去分辨图形"},{"question":"有较强的生活自理能力"},{"question":"很注意环境卫生"},{"question":"当他(她)看到一些东西能在实际中运用的时候，非常容易的学会它"},{"question":"会说一些简单的英语单词"},{"question":"能比较快地学会新教的歌曲"},{"question":"能很好地模仿他人的行为"},{"question":"懂道理、不蛮横，能克服自己的任性行为"},{"question":"能演奏乐器或参加合唱且水平较高"},{"question":"知道许多动植物的名称"},{"question":"能够为熟悉的歌曲增编新的歌词"},{"question":"喜欢画画和涂鸦且水平超过同龄小朋友"},{"question":"知道三个以内物品的数量与数字的对应"},{"question":"能较准确地将东西按类别放置"},{"question":"比较富有同情心并且关心他人"},{"question":"能用较生动的动作表达自己(如手势、眼神、表情等)"},{"question":"经常会做很奇怪的、栩栩如生的梦"},{"question":"喜欢跳舞、攀爬"},{"question":"喜欢问事物是怎样运行或怎样发挥作用"},{"question":"喜欢询问人的出生、死亡等方面的奇怪问题"},{"question":"表现出较好的动作协调性"},{"question":"喜欢讲童话故事或说笑话"},{"question":"与同龄人相比有较好的嗓音"},{"question":"拼写汉字、数字的能力比同龄人发展得快"},{"question":"与其他小朋友交流时很高兴，表现也更积极"},{"question":"喜欢续编或改编故事"},{"question":"喜欢追问地球的起源、人类的起源等方面的问题"},{"question":"能够通过图画联想到很多事物"},{"question":"似乎是天生的“领导人”、“小大人”"},{"question":"很喜欢对周围的新旧事物进行分类"},{"question":"对自然现象的变化很敏感"},{"question":"对图片、地图和表格比较感兴趣"},{"question":"常常能独立思考问题"},{"question":"与其他小朋友相比较有主见"},{"question":"相比之下，在同一环境中对声音很敏感"},{"question":"喜欢收藏石头、树叶、昆虫和邮票等"},{"question":"爱看艺术作品"},{"question":"喜欢计算数字并计算得较准确"},{"question":"喜欢听各种音乐"},{"question":"主动、大胆、相对较少地服从"},{"question":"喜欢观察鸟类、蝴蝶和树木等"},{"question":"能够很容易地分清上下、左右、前后和里外等概念"},{"question":"喜欢数数和用数字做其它游戏"},{"question":"很容易记住其他小朋友的名字、地点名称等"},{"question":"非常在乎自己能否在一些重人事情中扮演重要的角色"},{"question":"与同龄人相比自尊心较强"},{"question":"具有很强的掌握精细动作和一般动作的技能"},{"question":"经常无意识地哼唱歌曲"},{"question":"表演唱歌、跳舞=宵目时表现很积极"},{"question":"在人越多的环境下，表现得越高兴"},{"question":"很喜欢与别的小朋友玩耍且发生冲突较少"},{"question":"关心世界上是否存在其他一些智能生命"},{"question":"对去参观动物园、历史博物馆等有浓厚的兴趣"},{"question":"能经常提出一些比较好的建议"},{"question":"具有掌握平衡的能力"},{"question":"能按照某一标准对物体进行归类"},{"question":"听故事时能够跟上思路"},{"question":"喜欢讨论生活方面的问题"},{"question":"经常在书本或其它物品上乱涂乱画"},{"question":"喜欢玩迷津游戏并能较好地完成"},{"question":"长时间坐着不动对他(她)来说很困难"},{"question":"能够较流利地背诵诗歌、散文等"},{"question":"认为动植物是生活中不可缺少的东西"},{"question":"能较清楚地知道自己的优缺点"},{"question":"喜欢到一些能激励人的地方去参观"}]},
    }
  }
})
