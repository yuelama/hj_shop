// hj_shop/pages/user/user.js
let apps =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
	 isLogin: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
     var _self = this
     apps.util.request({
       'url': 'entry/wxapp/Userinfo',
       header: {
         'content-type': 'application/json' // 默认值
       },
     /*  data: {
           imgUrls: _self.data.items,
       }, */
       success(res) {
     		   console.log(res)
     		    var infodata = [];
     		   				 for (var i = 0; i < 1; i++) {					
     		   				   infodata[i] = res.data.data[i]
     		   					
     		   				 } 
      //console.log(res)
        _self.setData({
          userInfo: infodata
     		  
        })
      	   
       }
     })
     			
  },
  
Login: function () {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/hj_shop/pages/login/login',
      })
    }
  },
  
 checkLogin: function () {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/hj_shop/pages/login/login',
      })
    }
  },  
  

Tooders: function (e) {
   // this.checkLogin();
    let type = e.currentTarget.id;
    wx.navigateTo({
      //url: '/hj_shop/pages/order_Result/order_Result?type=' + type,
	  url: '/hj_shop/pages/order_info/order_info'
    })
  },
  
  
  ToAddress:function( ){
	var openid = wx.getStorageSync('userid');
	if('openid'){
		wx.navigateTo({
		  url: '/hj_shop/pages/address/address'
		})
	}else{
		wx.navigateTo({
		  url: '/hj_shop/pages/login/login'
		})
	}
  	
  	 
  },
  
  
  ToCoupon: function () {
  //  this.checkLogin();
    wx.navigateTo({
      url: '/hj_shop/pages/coupon/coupon'
    })
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