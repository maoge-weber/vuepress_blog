module.exports = {
  "title": "猫哥",
  "description": "逃出这烟火气的城市吧",
  "dest": "dist",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "https://pan.zealsay.com/blog/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ],
    ['script', {}, `
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?b0aae218897fa9d8a9f76e9a77e0b3c6";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();
        `] //百度统计
  ],
  "locales": {
    "/": {
      "lang": 'zh-CN'
    }
  },
  // "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "主页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "时间轴",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "关于",
        "link": "/about/",
        "icon": "reco-account"
      }
    ],
    "type": "blog",
    "sidebar": false,
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "博客"
      },
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    "friendLink": [
      // {
      //   "title": "作者博客",
      //   "desc": "zealsay说你想说",
      //   "logo": "./public/logo.png",
      //   "link": "https://blog.zealsay.com"
      // },
      // {
      //   "title": "另一个博客",
      //   "desc": "vuepress_blog",
      //   "logo": "https://pan.zealsay.com/blog/logo.png",
      //   "link": "https://www.zealsay.com"
      // },
      // {
      //   "title": "午后南杂",
      //   "desc": "Enjoy when you can, and endure when you must.",
      //   "logo": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      //   "link": "https://www.recoluan.com"
      // },
      // {
      //   "title": "zealsay开发指南",
      //   "desc": "zealsay轻应用脚手架开发指南",
      //   "logo": "https://pic.zealsay.com/20190909225214850000000.jpg",
      //   "link": "https://docs.zealsay.com"
      // }
    ],
    "valineConfig": {
      "appId": "IIdsmwv4AnRsALe4WzNqWQs0-gzGzoHsz",// your appId
      "appKey": "igWX6RNWgMgVMmd9rLzQtbeG", // your appKey
      "avatar": "robohash", //
      "enableQQ": true, //启用昵称框自动获取QQ昵称和QQ头像
      // "requiredFields": ['nick', 'mail'], //设置必填项
      "requiredFields": ['nick'], //设置必填项
    },
    "logo": "/logo.png",
    // "huawei": true, //首页出现华为文案
    "search": true,
    "searchMaxSuggestions": 10,
    // "lastUpdated": "Last Updated",
    "lastUpdated": false,
    "author": "猫哥",
    "authorAvatar": "/logo.png",
    "record":'豫ICP备2023003447号-1', //icp备案
    "startYear": "2017",
    "info": "一名被迫搬砖的IT民工/建造师/公路工程师/摄影狗，一只前端开发。",
    "socials":{
      "github" : false, //github
      "gitlub" : false, //gitlub
      "gitee" : false, //gitee
      "jianshu" : false, //简书
      "zhihu" : false, //知乎
      "toutiao" : false, //知乎
      "juejin": false, //掘金
      "segmentfault" : false, //思否
      "csdn" : false, //CSDN
      "wechat" : "WD_793082434", //微信
      "qq" : "http://wpa.qq.com/msgrd?v=3&uin=793082434&site=qq&menu=yes" //QQ
    },
    "mottos": [{
      "zh": "愿你保持初心和善良,笑里尽是温暖与坦荡。",
      "en": "May you keep your original heart and kindness, and smile with warmth and magnanimity."
    },
      {
        "zh": "年轻就是无限的可能。",
        "en": "Youth means limitless possibilities."
      },
      {
        "zh": "人生不就是不断的送死，然后重生",
        "en": "Life is not just a matter of dying and being born again."
      },
      {
        "zh": "不为模糊不清的未来担忧，只为清清楚楚的现在努力。",
        "en": "Don't worry about the vague future, just strive for the clear present."
      },
      {
        "zh": "与其装腔作势企图影响别人，不如咬牙切齿狠命修理自己。",
        "en": "Rather than pretending to influence others, it's better to grind your teeth and repair yourself."
      }, {
        "zh": "上天是公平的，只要努力就会有收获，否则就是你不够努力。",
        "en": "God is fair, as long as effort will include results, otherwise is you hard enough."
      },
      {
        "zh": "人生没有后悔，我们只能尽力去不让自己后悔。",
        "en": "Life without regret, we can only do our best to not to regret."
      }
    ],
    "covers": [
      './public/bac1.jpg',
      './public/bac2.png',
      './public/bac3.png',
      './public/bac5.jpg',
      './public/bac1.jpg',
      './public/bac2.png',
      './public/bac3.png',
      './public/bac11.jpg',
    ],
    "codeTheme": "tomorrow"
  },
  "markdown": {
    "lineNumbers": false
  },
  // configureWebpack: (config, isServer) => {
  //   if (!isServer) {
  //     // 修改客户端的 webpack 配置
  //     config.output.publicPath = config.mode === 'production'
  //       ? 'https://pan.zealsay.com/blog/' // sample/essays 打包的默认路径为 ''_nuxt' 或者可以指定cdn 域名
  //       : '/';
  //     config.output.filename = "assets/js/[name].js";
  //   }
  // }
}