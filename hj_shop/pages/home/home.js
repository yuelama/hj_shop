// hj_shop/pages/home/home.js
let apps = getApp();
var that = this;
//import { NoticeBar } from '/miniprogram_npm/@vant/weapp/notice-bar/index.js';
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
   notext: {
	   title:'2公斤起送 满3公斤打9.5折 5公斤9折'
   },
   menu1content: [{
     icon: 'iconfont icon-canshi',
     title: '菜品调配'
   }, {
     icon: 'iconfont icon-lingdang-copy',
     title: '售后服务'
   }, {
     icon: 'iconfont icon-mifen2',
     title: '主食调配'
   }, {
     icon: 'iconfont icon-jiubei',
     title: '赠送酒水'
   }],
   
   
   /* coupon: {
     id: 'code123123',
     delmoney: 10,
     condition: 100,
     time: '2020-5-20'
   }, */
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
	 status:1,
    
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
	  		//console.log(res)
	  		 var proinfo = [];
	  		for (var i = 0; i < res.data.data.products.length; i++) {
	  			proinfo[i] = res.data.data.products[i]
	  		} 
			//console.log(proinfo)
	  		that.setData({				
	  			products:proinfo
	  		})
			//console.log(that.data.products)
			 wx.stopPullDownRefresh() 
			wx.setStorageSync('products',that.data.products)
			
	  	}
	  
	  })
	  
     this.getbannerinfo()
	 this.getcateinfo()	 
  },
  
  
onPullDownRefresh(){
	  this.onLoad(true)
  },
  
 /* onReachBottom(){
	  this.page + = 1
	   this.onLoad()
  }, */
  
 /**
    * 添加商品  需要添加对应商品信息 购买的数量
    * @param e
    */
   addorder: function addorder(e) {
 	   var goodsId = e.currentTarget.dataset.goodsid;
		var openid = wx.getStorageSync('userid');
		
	  if('openid'){
 	       if (!goodsId) {
 	         return wx.showModal({
 	           title: '抱歉',
 	           content: '您选的商品暂时无法提供',
 	           showCancel: false,
 	           confirmText: '我知道了'
 	         });
 	       }
 	       var chooseGoods = this.data.chooseGoods;
 	       var goods = chooseGoods.goods;
 	       var count = goods[goodsId];    //获取购买数量 
 	       // 已有该商品
 	       if (count) {
 	         goods[goodsId] = ++count;
 	   	   
 	       } else {
 	         goods[goodsId] = 1;
 	       }
 	   	 
 	       chooseGoods.goods = goods;    //包含购买数量商品
 	   	
 	       this.setData({
 	         chooseGoods: chooseGoods
	       });
	       	
	            var money = this.calculateMoney();
	           chooseGoods.money = money; 
	           // 增加计数
	           ++chooseGoods.allCount;   // 选取商品数量 
	           this.setData({
	             chooseGoods: chooseGoods
	           });
	           wx.setStorageSync('chooseGoods', this.data.chooseGoods);
	       	// console.log(this.data.chooseGoods)
		}else{
			wx.switchTab({
				url:'../login/login'
			})
		}
		this.onLoad();
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
    var goods = this.data.chooseGoods.goods;
    var menuList = this.data.products;
	//console.log(menuList)
    var money = 0;
    var singleMoney = 0;
    for (var goodsId in goods) {
      // console.log(goodsId)
      // console.log(goods[goodsId])
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = menuList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var lists = _step.value;

              var goodsID = _step.value;
                // console.log(goodsID.id)
			  
              if (goodsID.id === goodsId) {
               // console.log(goodsID.price)
                // console.log(goods[goodsId])
                singleMoney = goodsID.price * goods[goodsId];
                // console.log('success')
              }
              // return console.log(goodsID)
            }
         
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      money += Number(singleMoney);
	  
	  var tomoney = money;
	  money = parseFloat(tomoney.toFixed(4));
	  
    }
    return money;
  },


/**
   * 确认订单
   */
  goCheckOrder: function goCheckOrder() {
    if (this.data.chooseGoods.allCount <= 0) {
      return wx.showToast({
        title: '您还没有购买商品',
        icon: 'success',
        mask: true
      });
    }
	
    // todo 提交订单信息，然后去到确认页面
    wx.navigateTo({
      url: '/hj_shop/pages/order/order?order=true&status=1'
	 //  url: '/pages/pay-result/pay-result?status=1&actualPrice=' + actualPrice,
    });
	
 },

 
   /**
    * 删除商品
    * @param e
    */
   delorder: function delorder(e) {
     var goodsId = e.currentTarget.dataset.goodsid;
     var chooseGoods = this.data.chooseGoods;
     var goods = chooseGoods.goods;   //获取商品信息
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
	 var g = chooseGoods.goods;
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
	 this.onLoad();
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
   * 显示购物车内容
   */
  showContent: function showContent() {
    if (this.data.chooseGoods.money <= 0) return;
    this.setData({
      showShopCarContent: !this.data.showShopCarContent,
      showMask: !this.data.showMask
    });
	//console.log(this.data.showShopCarContent)
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
     var that = this;
         that.setData({
           currentTab: 0 //当前页的一些初始数据，视业务需求而定
         })
         this.onLoad(); //重新加载onLoad()
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