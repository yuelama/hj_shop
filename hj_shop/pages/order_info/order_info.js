// hj_shop/pages/order_info/order_info.js
let apps =getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     orderList:[],
	 active: 0,
	 loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
	 this.loadData();
  },
  
  scrollListen: function (e) {
    console.log("滑到底部啦 该加载下一页数据啦")
  },
  
  loadData: function ( ) {
    this.setData({
      loading: true
    })
   var that = this;
    var openid = wx.getStorageSync('userid');
    // console.log(openid); 
   if('openid') {
   	 apps.util.request({
   	   'url': 'entry/wxapp/Getorderinfo',
   	   header: {
   	     'content-type': 'application/json' // 默认值
   	   },
   	 /* data: {
   	       openid:wx.getStorageSync('userid')
   	   }, */
   	   success(res) {
   		   console.log(res)
   		   var orders = [];
   		   for(var i=0;i<res.data.data.length;i++){
   			   orders[i] = res.data.data[i]
   		   }
   		   		   
   	 			that.setData({
   					orderList:orders
   					
   				})
   	 			
   	 			}
   	 		})
    }else{
   	 wx.navigateTo({
   	   url: '/hj_shop/pages/login/login'
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