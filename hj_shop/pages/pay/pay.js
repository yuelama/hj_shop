// hj_shop/pages/pay/pay.js
let apps = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     orderno:'',
     payorder:[]    
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    console.log(options)
	var that = this;	
	 if(options.pay =='true'){
	  apps.util.request({
	  	'url': 'entry/wxapp/Getorder',
	  	header: {
	  		'content-type': 'application/json'
	  	},
		data:{
			orderno:options.orderid
		},
	  	success(res) {
			   console.log(res)
		       that.setData({
				   payorder:res.data.data
			   })
			   
	          } 
		})
	 }else if(options.status == 1){
		  apps.util.request({
		  	'url': 'entry/wxapp/Getorder',
		  	header: {
		  		'content-type': 'application/json'
		  	},
		  		data:{
		  			orderno:options.payno
		  		},
		  	success(res) {
		  			   console.log(res)
		  		       that.setData({
		  				   payorder:res.data.data
		  			   })
		  			   
		          } 
		  		})
		 
		 }
  },

confirm:function(){
	   var that = this;
	   var arr =this.data.payorder;	  
		var order_num = arr[0].order_num;	
		var price = arr[0].order_price;	
        var orderid = arr[0].order_no;
		var title = arr[0].order_name;		
		var app = getApp();
		wx.showModal({
			title: '提示',
			content: '是否进行微信支付？全部结算金额为：' + price + '元',
			success: function(res) {
				if (res.confirm) {
					app.util.request({
						'url': 'entry/wxapp/Pay', //调用wxapp.php中的doPagePay方法获取支付参数
						data: {
							price: price,
							title: title,						
							orderid:orderid,
							order_num: order_num
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
									'success': function(res) {
										console.log(res)
										//执行支付成功提示
										console.log('支付成功')
										//清除购物车信息 
									    wx.removeStorageSync('products');	
										wx.removeStorageSync('chooseGoods');	
										that.setData({
											//iscart: false,
											//icon:[],
											order_num: '',											
											price: '',
											orderid:'',
											title: ''
	                                        
										});
										
										wx.reLaunch({ //关闭所有页面，打开到应用内的某个页面
											url: "../home/home",
										}); //console.log(res)
									  																	
									},
	
									'fail': function(res) {
										//  backApp()
										console.log(res)
									},	
								})
							}
						},
						fail(res) {
							wx.showModal({
								title: '系统提示',
								content: res.data.message ? res.data.message : '错误',
								showCancel: false,
								success: function(res) {
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
	
	wx.removeStorageSync('products');
	wx.removeStorageSync('chooseGoods');
	
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