let apps = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		products: [], //商品数据
		banner: [], //商品图片轮播数据
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
		
		// 商品分类数据
		catedata: [],
       bannerid:'',
	    cateid:'',
		productid: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var that = this;
		apps.util.request({
			'url': 'entry/wxapp/product',
			header: {
				'content-type': 'application/json'
			},
			success(res) {
				//console.log(res)
				var proinfo = [];
				for (var i = 0; i < 2; i++) {
					proinfo[i] = res.data.data.products[i]
				}
				that.setData({
					products: proinfo
				})
			}

		})
		this.getcateinfo();
        this.getbannerinfo();
	},
	
	
	//跳转到详情页面
	Toproductdetail: function (event){
     // console.log(event)
	  wx.navigateTo({
	  	url:'/hj_shop/pages/productdetail/productdetail?id='+event.currentTarget.dataset.productid,
	  }) 
		
	},
	

	// 获取分类数据信息
	getcateinfo: function() {
		var that = this;
		apps.util.request({
			'url': 'entry/wxapp/Category',
			header: {
				'content-type': 'application/json'
			},

			success(res) {
				//console.log(res)
				var cates = [];
				for (var i = 0; i < 4; i++) {
					cates[i] = res.data.data.categorydatas[i]

				}

				that.setData({
					catedata: cates
				})
			}
		})
	},
	
	//获取分类详细页面
	Tocatelist: function (event){
			console.log(event)
		  wx.navigateTo({
		  	url:'/hj_shop/pages/catelist/catelist?id='+event.currentTarget.dataset.cateid,
		  }) 
			
		},	
	
	// 获取商品轮播图片信息
	getbannerinfo: function() {
		var that = this;
		apps.util.request({
			'url': 'entry/wxapp/Banner',
			header: {
				'content-type': 'application/json'
			},
	
			success(res) {
				//console.log(res)
			 var bandata = [];
				for (var i = 0; i < res.data.data.bannerdata.length; i++) {
					bandata[i] = res.data.data.bannerdata[i]
	
				}
	
				that.setData({
					banner: bandata
				})
			}
		})
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
