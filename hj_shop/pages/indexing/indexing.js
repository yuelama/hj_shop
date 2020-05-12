// hj_shop/pages/indexing/indexing.js
let apps = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   banner: [], //商品图片轮播数据
   indicatorDots: true,
   autoplay: true,
   interval: 5000,
   duration: 1000,
   
   userSite:"",
   product_list:{},
   products:[],
   
   // 当前的tab
   currentmenu: 1,
   // 当前的left栏
   currentleftmenu: 0,
   // 侧边栏联动当前值
   currentmenuid: '',
   // 设置scroll-view的高度
   scrollHeight: 880,
   needDistance: 0,
   scrollHeight2: 815,
   showShopCarContent: false,
   showMask: false,
   
   chooseGoods: {
     // 饭店id
    // restaurant_id: 'renmaid',
     // 选择的商品数量
     goods: {},
     // 总金额
     money: 0,
     // 总数
     allCount: 0
   }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var that = this;
	  apps.util.request({
	  	'url': 'entry/wxapp/product',
	  	header: {
	  		'content-type': 'application/json'
	  	},
	  	success(res) {
	  		console.log(res)
	  		 var proinfo = [];
	  		for (var i = 0; i < res.data.data.products.length; i++) {
	  			proinfo[i] = res.data.data.products[i]
	  		} 
			//console.log(proinfo)
	  		that.setData({
				product_list:res.data.data.products,
	  			products:proinfo
	  		})
	  	}
	  
	  })
	  
     this.getbannerinfo()
	 this.getcateinfo()	 
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

/**
   * 设置右侧滚动栏的位置
   */
/*  setNeedDistance: function setNeedDistance() {
    if (!this.data.restaurant.coupon.id) return;
    this.setData({
      needDistance: 142
    });
  }, */

  /**
   * 改变menu选择
   * @param e
   */
  choose: function choose(e) {
   // console.log(e)
    this.setData({
      currentmenu: e.currentTarget.dataset.tab
    });
  },

  /**
   * 改变left menu选择
   * @param e
   */
  leftChoose: function leftChoose(e) {
	  //console.log(e)
    this.setData({
      currentleftmenu: e.currentTarget.dataset.menu,
      currentmenuid: e.currentTarget.dataset.menulistid
    });
  },

 /**
   * 计算消费金额
   */
  calculateMoney: function calculateMoney() {
	var _self = this;
	// 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）
	var arr = wx.getStorageSync('cart') || [];		
		//console.log(arr)
	// 有数据的话，就遍历数据，计算总金额 和 总数量
    if (arr.length > 0) {
        for (var i in arr) {
           _self.data.total += (arr[i].price) * (arr[i].product_num);  //获取购物车商品总价格				
            _self.data.goodsCount += (arr[i].product_num);    		
        } 				 																																																																		
        // 更新数据
    	var totals = _self.data.total;
    	  _self.data.total = parseFloat(totals.toFixed(2));    
      
        this.setData({
            iscart: true,
            cart: arr,
            total: _self.data.total,
          goodsCount: _self.data.goodsCount ,	  		  
        });
		}
  }, 



 /**
   * 添加商品
   * @param e
   */
  addorder: function addorder(e) {
	  console.log(e)
    var goodsId = e.currentTarget.dataset.goodsid;
    if (!goodsId) {
      return wx.showModal({
        title: '抱歉',
        content: '您选的菜品暂时无法提供',
        showCancel: false,
        confirmText: '我知道了'
      });
    }
    var chooseGoods = this.data.chooseGoods;
    var goods = chooseGoods.goods;
    var count = goods[goodsId];
    // 已有该商品
    if (count) {
      goods[goodsId] = ++count;
    } else {
      goods[goodsId] = 1;
    }
    chooseGoods.goods = goods;
    this.setData({
      chooseGoods: chooseGoods
    });
	
    var money = this.calculateMoney();
    chooseGoods.money = money;
    // 增加计数
    ++chooseGoods.allCount;
    this.setData({
      chooseGoods: chooseGoods
    });
    wx.setStorageSync('chooseGoods', this.data.chooseGoods);
  },

  /**
   * 删除商品
   * @param e
   */
  delorder: function delorder(e) {
    var goodsId = e.currentTarget.dataset.goodsid;
    var chooseGoods = this.data.chooseGoods;
    var goods = chooseGoods.goods;
    var count = goods[goodsId];
    goods[goodsId] = --count;
    chooseGoods.goods = goods;
    this.setData({
      chooseGoods: chooseGoods
    });
    var money = this.calculateMoney();
    chooseGoods.money = money;
    // 减少计数
    --chooseGoods.allCount;
    if (chooseGoods.allCount <= 0) {
      this.setData({
        showMask: false,
        showShopCarContent: false
      });
    }
    this.setData({
      chooseGoods: chooseGoods
    });
    wx.setStorageSync('chooseGoods', this.data.chooseGoods);
  },



/**
   * 用户选择位置
   * @returns {boolean}
   */
  chooseLocation: function chooseLocation() {
    // console.log(1)
    var that = this;
    wx.chooseLocation({
      success: function success(res) {
        console.log(res);
        if (res.name.length <= 0) {
          return that.setData({
            userSite: res.address
          });
        }
        that.setData({
          userSite: res.name
        });
      }
    });
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