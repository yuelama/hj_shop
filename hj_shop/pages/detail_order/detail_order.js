// hj_shop/pages/detail_order/detail_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {	  
	  hasNoCoupons: true,
	  youhuijine: 0, //优惠券金额
	  address:[],
     order_num:'',
	 total_price:'',
	 order_pic:'',
	 actualPrice:'',
	 couponCount: 2,
	 coupon: {
	   id: "",
	   title: "",
	   discount: 0
	 },		
	 order_title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
	 this.setData({
	 	order_num: options.detail_num,
	 	total_price: options.detail_price,
	 	order_pic:options.detail_pic,
		order_title:options.detail_title
	 })
	 if (this.data.total_price >= 1) {
	   this.setData({
	     expressPrice: 0
	   })
	 } else {
	   this.setData({
	     expressPrice: 10
	   })
	 }
	// 实际价格总计
	let actual_Price = this.data.expressPrice/10 + this.data.total_price  - this.data.coupon.discount
	
	this.setData({
	  actualPrice: actual_Price
	})		 
  },
 
 ToPay: function (e) {
	// console.log(e)
     var that = this;
	 var openid = wx.getStorageSync('userid');
	 if('openid'==''){
	 	wx.switchTab({
	 		url:'/hj_shop/pages/login/login'
	 	})
	 } else if (!this.data.address.userName) {
	       this.chooseAddress();
	       } else {
	         this.wxpay();
	       }		

   
},

 // 选择收货地址
 chooseAddress: function ( ) {
	// console.log(e)
	let that = this;
	wx.chooseAddress({
		success: res => {
			this.setData({
				address: res
			})
		}				
	}) 
  },
  
 // 添加收货地址
  openAddress:function( ){
	 let that = this;
	 wx.chooseAddress({
	 	success: res => {
	 		this.setData({
	 			address: res
	 		})			
	 	}				
	 })  
  },
  
/* apps.util.request({
 'url': 'entry/wxapp/Address',
 header: {
   'content-type': 'application/json'
 },	
 	data:{
 			
 	} ,		 
 success(res) {	 */	 
  
  
wxpay:function(){
	   var that = this;
	       var order_num = this.data.order_num;
	  		var actualPrice = this.data.actualPrice;
			//console.log(actualPrice)
	  		//var orders = this.data.orders;		
	  	 var title = '总计';	  		
	  var app = getApp();	   
	  		   wx.showModal({
	  		    title: '提示',			
	  		    content: '是否进行微信支付？全部结算金额为：' + actualPrice+'元',
	  		    success: function (res) {			
	  		      if (res.confirm) {
	  		   	   app.util.request({
	  		   	    'url': 'entry/wxapp/Pay', //调用wxapp.php中的doPagePay方法获取支付参数
	  		   	    data: {
	  		   	       price:actualPrice,
	  		   	       title:title,		           
					   order_num:order_num
	  		   	    },
	  		   	    'cachetime': '0',
	  		            success(res) {	
	  		               if (res.data && res.data.data && !res.data.errno) {
	  		                   //发起支付
	  		                   wx.requestPayment({
	  		                       'timeStamp': res.data.data.timeStamp,
	  		                       'nonceStr': res.data.data.nonceStr,
	  		                       'package': res.data.data.package,
	  		                       'signType': 'MD5',
	  		                       'paySign': res.data.data.paySign,
	  		                       'success': function (res) {
	  		                           //执行支付成功提示
	  		   					     console.log('支付成功')	
	  								//清除购物车信息 
	  								//wx.removeStorageSync('cart')		
	  		   						 	 that.setData({
	  		   						 	    //iscart: false,
	  		   								//icon:[],
	  										 order_num:'',
	  		   						 	     orders:[],
	  										 actualPrice:'',
											 title:'' 
	  		   												   
	  		   						 	}); 		   							
	  		           				 wx.switchTab({//接着跳到购物车页
	  		           						url: "../index/index",
	  		           					  }); 															//console.log(res)																	
	  		                       },
	  		           								
	  		   					  'fail': function (res) {
	  		   					  //  backApp()
	  		   					},
	  		   												 
	  		   					})	
	  		   					}
	  		   					},
	  		   						 fail(res) {
	  		   						     wx.showModal({
	  		   						         title: '系统提示',
	  		   						         content: res.data.message ? res.data.message : '错误',
	  		   						         showCancel: false,
	  		   						         success: function (res) {
	  		   						             if (res.confirm) {
	  		   						               // backApp()											   
	  		   						             }
	  		   						         }
	  		   						     })
	  		   						 }								 
	  		   					})	
	  		   				}
	  		   			}
	  		        })   
		//wx.removeStorageSync('cart');
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