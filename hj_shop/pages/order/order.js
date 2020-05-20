let apps = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		openid: '',
		cartlist: [],
		
		products:{},
		
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
		var products = wx.getStorageSync('products');
        if(options.order == 'true')
		var arr =[];
		for(var i in products){
			var goodsid = products[i].id
			var productList = wx.getStorageSync('chooseGoods');	
			for(var j in productList.goods){
				if(goodsid ==j){
					  products[i].product_num = productList.goods[j]
					  arr.push(products[i]);
					
				}										
			}			
		}		   
		 this.setData({
		  order_num: productList.allCount,
		  total_price: productList.money,
		  products:arr
		})
		
		// 判断运费
		if (this.data.total_price >= 0.20) {
			this.setData({
				expressPrice: 0
			})
		} else {
			this.setData({
				expressPrice: 0.10
			})
		}
		// 实际价格总计		
		let actual_Price = that.data.expressPrice  + that.data.total_price - that.data.coupon.discount
       
		this.setData({
			actualPrice: actual_Price
		}) 
	},

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {
  
	/* let that = this;
	 var addressList = this.data.address;
      console.log(addressList)
			//让传过来的参数 与现有数据库对比 如果ID相同就取出，并设置checke为true
	  this.data.addressList.forEach(function (v, index) {
	    if (options.addressId == v.id) {
	      that.setData({
	        [`addressList[${index}].checked`]: true
	      });
	    }
	  }) */		 	   
	
	
   },

/* var that =this;
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
     		             }) */

	/* 获取留言信息 */
	bindTextAreaBlur: function(e) {
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
      this.addAddress()  	 
	}, 

	
	/* 添加收货地址 */
   addAddress: function() {		
		let that = this;
		wx.chooseAddress({
		success: res => {
		 that.setData({
					address: res
					}) 
				this.loadaddress()  						//wx.setStorageSync("addr_info",res)
				} 
		 })     			
	}, 

  loadaddress:function(){
	  let that = this;
	  let r = this.data.address;
	  let addr = r.provinceName+ " " + r.cityName + " " + r.countyName;
	  		 let street = r.detailInfo;
	  		 let user_name =r.userName;
	  		 let user_mobile =r.telNumber;
	  		 apps.util.request({
	  		  	     'url': 'entry/wxapp/Addaddress',
	  		  	     header: {
	  		  	       'content-type': 'application/json' // 默认值
	  		  	     }, 
	  		  	     data:{
	  		  	   	name:user_name,
	  		  	   	mobile:user_mobile,
	  		  	   	address:addr,
	  		  	   	street:street,				
	  		  	    openid:wx.getStorageSync('userid')
	  		  	     },
	  		  	     success(res) {
	  		  	   	   console.log(res)		
	  		       }
	  		 	})

  },

	ToPay: function(e) {
		var that = this;
		//var address = that.data.address;
		var actprice = this.data.actualPrice; //实际支付现金
		var message = that.data.content; //获取用户留言信息	
		var title = this.data.products[0].product_name;
		var order_img = this.data.products[0].img;
			
		if (!this.data.address.userName) {
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
      wx.removeStorageSync('chooseGoods');	   	
	},
	
    wxpay: function() {
		var that = this;
		var order_num = this.data.order_num;
		// console.log(order_num)
		var actualPrice = this.data.actualPrice;
		var products = this.data.products;	
		console.log(products)
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
							products:products,
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
											products: [],
											actualPrice: '',
											title: ''
                                            
										});
										
										wx.reLaunch({ //关闭所有页面，打开到应用内的某个页面
											url: "../home/home",
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
	wx.removeStorageSync('products');
	wx.removeStorageSync('chooseGoods');
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
		this.onLoad()
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