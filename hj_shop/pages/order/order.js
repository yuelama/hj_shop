let apps = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		openid: '',
		cartlist: [],
		
		orderlist: {},
		order_id:'',
		order_num: '',
		total_price: '',
			
		product_pic: '',
		actualPrice: '', //实际价格
		text: "",
		
        couponCount: 2,
        coupon: {
          id: "",
          title: "",
          discount: 0
        },			
		
		productList: [], //购物车商品列表    
		expressPrice: 0, //运费
		orders: [],
		address: {},		
		isDefault:true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		//console.log(options)
		var that = this;
		//var orderinfo = wx.getStorageSync('cart') || [];
		var productList = wx.getStorageSync('chooseGoods');		
	
		 this.setData({
		  order_num: productList.allCount,
		  total_price: productList.money,
		  orderlist:productList.goods
		})
			
		// 判断运费
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
		let actual_Price = that.data.expressPrice  + that.data.total_price - that.data.coupon.discount
       
		this.setData({
			actualPrice: actual_Price
		}) 
		this.Goodsinfo()
	},

Goodsinfo:function(){
      var that = this;	
	  var arr = this.data.orderlist;
	  apps.util.request({
	  	'url': 'entry/wxapp/product',
	  	header: {
	  		'content-type': 'application/json'
	  	},	
	  	success(res) {
	  		//console.log(res)
	  		 var proinfo = [];
	  		for (var i = 0; i < res.data.data.products.length; i++) {
	  			proinfo[i] = res.data.data.products[i]
	  		} 
			//console.log(proinfo)
	  		that.setData({
				
	  			products:proinfo
	  		})
	  	}
	  
	  })

},

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {
   //this.chooseAddress()
     var that =this;
     			apps.util.request({
     			  'url': 'entry/wxapp/Openaddr',
     			  header: {
     			    'content-type': 'application/json' // 默认值
     			  }, 
     			  data:{
     				  isDefault:this.data.isDefault
     			  }, 
     			  success(res) { 
     				  console.log(res)
     				       var addrdata = [];
     				    	// for (var i = 0; i < res.data.data.length; i++) {
							for (var i = 0; i < res.data.data.length; i++) {
     				    		  addrdata[i] = res.data.data[i]	    		  				
     				    		   } 
     								that.setData({
     									address:addrdata
     								})	
			               
     						}
     		})
   },



	/* 获取留言信息 */
	bindTextAreaBlur: function(e) {
		//console.log(e)
		/* this.setData({
			text: e.detail.value
		}) */
		var that = this
		var value = e.detail.value,
		  len = parseInt(value.length);
		if (len > that.data.noteMaxLen)
		  return;
		that.setData({
		  content: value, 
		  noteNowLen: len
		})
	},
	
	
	
chooseAddress: function (e) {
	//console.log(e)
	let adress_id = e.currentTarget.dataset.value.id;
	/* console.log(e)
		 
		let addr = data.provinceName+ " " + data.cityName + " " + data.countyName;
	  wx.navigateTo({
	 	    url: '/hj_shop/pages/editaddr/editaddr?editaddr=true&name=' + data.userName + '&mobile=' + data.telNumber + '&addr=' + addr + '&street=' + data.detailInfo + '&postcode=' + data.postalCode +'&isDefault=' + this.data.isDefault
	  }) */
	  
	  wx.navigateTo({
	    url: '/hj_shop/pages/address/address?chooseMode=true&addressId=' + adress_id
	  })
	  
	}, 

	
	/* 添加收货地址 */
   addAddress: function() {
		
		wx.navigateTo({
		  url: '/hj_shop/pages/address/address?chooseMode=true'
		})
				
	}, 

	

	ToPay: function(e) {
		var that = this;
		/* var address = that.data.address;*/
		var actprice = this.data.actualPrice; //实际支付现金
		var message = that.data.content; //获取用户留言信息		
		var title = this.data.orders[0].product_name;
		//console.log(this.data.orders)
		var order_img = this.data.orders[0].img;
			
		if (!this.data.address.user_name) {
			this.addAddress()
		} else {
			 apps.util.request({
			 'url': 'entry/wxapp/createorder',
			header: {
			   'content-type': 'application/json'
						  },		
			data:{					
				title:title,
				order_img:order_img,
				openid:wx.getStorageSync('userid'),
				actprice:this.data.actualPrice,
				ordernum:this.data.order_num,				
				message:that.data.content,										
				} ,					 
			        success(res) {
						console.log(res)
			       }								        
			     }) 
			this.wxpay();
		}
		//wx.removeStorageSync('cart');		   	
	},


	wxpay: function() {
		var that = this;
		var order_num = this.data.order_num;
		var actualPrice = this.data.actualPrice;
		var orders = this.data.orders;	
		var title = '总计';
		var app = getApp();
		wx.showModal({
			title: '提示',
			content: '是否进行微信支付？全部结算金额为：' + actualPrice + '元',
			success: function(res) {
				if (res.confirm) {
					app.util.request({
						'url': 'entry/wxapp/Pay', //调用wxapp.php中的doPagePay方法获取支付参数
						data: {
							price: actualPrice,
							title: title,
							orders: orders,
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
										//执行支付成功提示
										console.log('支付成功')
										//清除购物车信息 
										wx.removeStorageSync('cart')
										that.setData({
											//iscart: false,
											//icon:[],
											order_num: '',
											orders: [],
											actualPrice: '',
											title: ''

										});
										wx.switchTab({ //接着跳到购物车页
											url: "../index/index",
										}); //console.log(res)																	
									},

									'fail': function(res) {
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
		//wx.removeStorageSync('cart');
	},


	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

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