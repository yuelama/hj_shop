//app.js

import util from 'we7/resource/js/util.js';
App({
  onLaunch: function () {
    // 展示本地存储能力
   var openid = wx.getStorageSync('userid');
   if (openid) { 
   	
   } else {
     //2 如果没有就到服务器去请求一下最新的然后缓存
     util.getUserInfo(function (userInfo) {
       util.request({
         'url': 'entry/wxapp/getuserid',
         header: {
           'content-type': 'application/json' // 默认值
         },
         success(res) {
          // console.log(res)
           //3 如果服务器显示用户没有注册,就跳转到授权注册页面
           if (res.data.data.status == 0) {
             wx.setStorageSync('userid', res.data.data.userid)
   		  	
           } else {
             wx.reLaunch({
               url: '/hj_shop/pages/login/login',
             })
           }
         }  
       })
     }) 
   }
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onError: function (msg) {
    console.log(msg)
  },
  
/*  setTabbar(){
	  const len = this.globalData.cart.reduce((sum,a)=>sum+a.num,0)
	  if(len>0){
		  wx.setTabBarBadge({
			  index:1,
			  text:len+'',
		  })
	  }
  }, */
  util: util,
  globalData: {
    userInfo: null
	
  },
  siteInfo: require('siteinfo.js')
})