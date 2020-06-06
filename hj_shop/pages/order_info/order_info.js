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
	  wx.setNavigationBarTitle({
	    title: '订单中心',
	  })
	 // console.log(options)
	  let type = options.type;
	  //console.log(type)
	  if (type) {
	    this.setData({
	      active: type
	    })
	  }  
	 // console.log(this.data.active)
	this.loadData(type)
  },
  
  changeTab: function (e) {
	  //console.log(e)
   let type = e.detail.index;
    // 模拟加载数据
    this.loadData(type)

  },
   
  
  scrollListen: function (e) {
    console.log("滑到底部啦 该加载下一页数据啦")
  },
  
  
  
 loadData: function (type ) {
    this.setData({
      loading: true
    })
	/* let that = this;
	let arr = that.data.orderList; */

	let that =this;
	 var openid = wx.getStorageSync('userid');
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
			  // console.log(res)
			   var orders = [];
			   for(var i=0;i<res.data.data.length;i++){
				   orders[i] = res.data.data[i]
			   }	  		   		   
		 			that.setData({
						orderList:orders	  					
					})	
				if (type && type != 0) {
				 let data = that.data.orderList.filter(item => item.status == type);					
				that.setData({
				   orderList: data,
				   loading: false
				 })
				}else {
					setTimeout(function () {
					    that.setData({
					      loading: false,
					      orderList: that.data.orderList
					    })
					  }, 1000)
					} 
					
		 	}
		})
	 }else{
		 wx.navigateTo({
		   url: '/hj_shop/pages/login/login'
		 })
	 }   
	
     
  },

 buyAgain: function (e){
	 //console.log(e)
    //let index = e.currentTarget.dataset.index;
    wx.switchTab({
      /* url: '/hj_shop/pages/home/home?id='+e.currentTarget.dataset.value.id, */
	    url: '/hj_shop/pages/home/home'
    }) 
  },


toPay: function (e) {
     let actualPrice = e.currentTarget.dataset.value.order_price;
	 let payno = e.currentTarget.dataset.value.order_no;
     wx.showModal({
       title: '提示',
       content: '是否进行微信支付？全部结算金额为：' + actualPrice + '元',
       showCancel: false,
       confirmColor: '#b4282d',
       success: function (res) {
         if (res.confirm) {
           wx.redirectTo({
             url: '/hj_shop/pages/pay/pay?status=1&payno=' + payno,
           })
         }
       }
     })
		 
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
   // 获取参数
   
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