// hj_shop/pages/productdetail/productdetail.js
let apps = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
	 //图片轮播参数
     indicatorDots: true,
     autoplay: true,
     interval: 5000,
     duration: 1000, 
	 bandetail:[],   //轮播图片数据
	 
	 productdetail:[],    //产品细节数据
	 productid:'',
	 payid:'',
	 
	 openid:'',
	
	  detail_price:'',
	 detail_title:'',
	  detail_num:'',
	  detail_pic:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //console.log(options)
	 let productid = options.id;
	 //console.log(options)
	  var that=this;
	    apps.util.request({
	    'url': 'entry/wxapp/Productdetail',
	    header: {
	      'content-type': 'application/json'
	    },	
	 		data:{
	 			id:productid,		
	 		} ,		 
	    success(res) {	  		
			  //console.log(res)
			  that.setData({
				  productdetail:res.data.data.details
			  })
			}
			
	  })
  },

/* openAddress: function () {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        if(!res.address){
          return;
        }
        that.setData({
          'deliveryAddress.address': res.address
        })
      },
    })
  },
 */

Addcart:function(event){
   var openid = wx.getStorageSync('userid');
	if('openid'){
	this.setData({
	          toastHidden:false
	      });
	for (var i in this.data.productdetail){
			  if(this.data.productdetail[i].id == event.currentTarget.dataset.productid){
					 this.joinT();											 
			   this.data.productdetail[i].product_num = 1;
				var arr = wx.getStorageSync('cart') || [];
				 if(arr.length>0){
	          // 遍历购物车数组				
	              for(var j in arr){
									 // 判断购物车内的item的id，和事件传递过来的id，是否相							
	                  if(arr[j].id == event.currentTarget.dataset.productid){											
											 // 相等的话，给count+1（即再次添加入购物车，数量+1）
	                      arr[j].product_num = arr[j].product_num + 1;																																																	
																						
						try {
	                          wx.setStorageSync('cart', arr)
	                      } catch (e) {
	                          console.log(e)
	                      }
	                      // 返回（在if内使用return，跳出循环节约运算，节约性能）
						 return;																					 
						}   															 
				     }					 
				 // 遍历完购物车后，没有对应的item项，把goodslist的当前项放入购物车数组
	              arr.push(this.data.productdetail[i]);																		 
		     	  }
			      
	          // 购物车没有数据，把item项pu  sh放入当前数据（第一次存放时）
	          else{
	              arr.push(this.data.productdetail[i]);			 
	          }
	          // 最后，把购物车数据，存放入缓存
	          try {
	              wx.setStorageSync('cart', arr)
	              // 返回（在if内使用return，跳出循环节约运算，节约性能）
	              return;	  
	          } catch (e) {
	              console.log(e)
								
	          }
																
		   }
	  }
     }else{
		 wx.switchTab({
		 		url:'/hj_shop/pages/login/login'
		 	})
	 }
},

/* onPullDownRefresh(){
	
} */

 Tocart:function(){
	wx.switchTab({
		url:'/hj_shop/pages/cart/cart'
	})
} ,

openIndexPage:function(){
	wx.switchTab({
		url:'/hj_shop/pages/index/index'
	})
} ,


/* buyNow: function () {
	var openid = wx.getStorageSync('userid');
	if('openid'){
	// 跳转checkout页面
	  wx.setStorageSync("orders", this.data.productdetail);
	 // wx.setStorageSync("checkoutProductSku", this.data.sku);
	  wx.navigateTo({
	    url: '/hj_shop/pages/order/order?from=productdetail'
	  })
	}
    
     else {
        wx.switchTab({//请登录
          url: "/hj_shop/pages/login/login"
        }) 	
	 
	 }
    
  }, */

 Tobuy:function(event){
	//console.log(event)
	var that = this;	
	var openid = wx.getStorageSync('userid');	
    if('openid'){
	for (var i in this.data.productdetail){
	  if(this.data.productdetail[i].id == event.currentTarget.dataset.productid){
			var detail_price =  this.data.productdetail[i].price; 
			var detail_title =  this.data.productdetail[i].product_name;
	        var detail_num = this.data.productdetail[i].product_num;
			var detail_pic = this.data.productdetail[i].img;
		}	
	 wx.navigateTo({
	  url: '../detail_order/detail_order?detail_price=' + detail_price +'&detail_num=' + detail_num + '&detail_title=' + detail_title + '&detail_pic=' + detail_pic
	}) 	
	}
	
	}else{
		wx.switchTab({//请登录
		  url: "/hj_shop/pages/login/login"
		}) 				
	}
},
 

joinF:function(){
    wx.showModal({
      title: '提示',
      content: '请勿重复添加',
	
    })
  },	
	
  joinT:function(){
	  wx.showModal({
	    title: '提示',
	    content: '是否添加商品',	 
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