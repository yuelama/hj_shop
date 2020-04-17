// hj_shop/pages/order/order.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		openid: '',
		orderinfo: [],
		order_num: '',
		total_price: '',
		text:'',
		
		orders: [],
		address: {},
		hasAddress: false

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		// console.log(options)
		var orderinfo = wx.getStorageSync('cart')|| [];
		this.setData({
			order_num: options.order_num,
			total_price: options.total_price,
			orders: orderinfo
		})
	},
	
	/* 获取留言信息 */
 bindKeyInput:function(e){
	 // console.log(e)
	  this.setData({
	        inputValue: e.detail.value
	      })
  }, 
  
 
 
  /* Addaddress:function(){
	  var that = this;
	  if (!that.data.hasAddress) {
	  	// 获取地址信息
	  	wx.chooseAddress({
	  		success: res => {
	  			this.setData({
	  				address: res
	  			})
	  		}				
	  	})
	  } else {
	  	 wx.showModal({
	  			 title:'请添加送货地址'
	  		 }) 
	  		  
	  }
   }, */

     // 清空购物车数据
     //wx.removeStorageSync('shopCarInfo');

	ToPay: function(e) {
		var that = this;
        /* var address = that.data.address;*/
		var text = this.data.inputValue;   //获取用户留言信息		
		var openid = wx.getStorageSync('userid'); 		
		if(openid ==''){
			wx.switchTab({
				url:'/hj_shop/pages/login/login'
			})
		} else if (!this.data.address.userName ) {
		       wx.chooseAddress({
		       	success: res => {
		       		this.setData({
		       			address: res
		       		})
		       	}				
		       })
		      } else {
		        this.wxpay();
		      }		
				//wx.removeStorageSync('cart');		   	
	},

   wxpay:function(){
	   var that = this;
	       var order_num = this.data.order_num;
	  		var total_price = this.data.total_price;
	  		var orders = this.data.orders;
			
	  	 var title = '总计';
	  		
	  var app = getApp();	   
	  		   wx.showModal({
	  		    title: '提示',			
	  		    content: '是否进行微信支付？全部结算金额为：' + total_price+'元',
	  		    success: function (res) {			
	  		      if (res.confirm) {
	  		   	   app.util.request({
	  		   	    'url': 'entry/wxapp/Pay', //调用wxapp.php中的doPagePay方法获取支付参数
	  		   	    data: {
	  		   	       price:total_price,
	  		   	       title:title,
			           orders:orders,
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
	  								wx.removeStorageSync('cart')		
	  		   						 	 that.setData({
	  		   						 	    //iscart: false,
	  		   								//icon:[],
	  										 order_num:'',
	  		   						 	     orders:[],
	  										 total_price:'',
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
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
    

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {
      /*  var _self=this;
        _self.setData({
			order_num: 0,
			total_price: 0,
			orders: []            
        }); */
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {
      this.onLoad();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
