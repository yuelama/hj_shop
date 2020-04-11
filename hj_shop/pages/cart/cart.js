// hj_shop/pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     iscart: false,	 
    // cart: [], //数据
     //count: 1,   //商品数量默认是1
     total: 0,    //总金额     
     goodsCount: 0 //数量   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       
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
  
  /* 加数 */
     addCount: function (e) {
         // 商品总数量+1
         this.data.goodsCount += 1;
  		var index = e.target.id.substring(3);
         // 总价钱 加上 对应项的价钱单价
         this.data.total += Number(this.data.cart[index].price);
         // 购物车主体数据对应的项的数量+1  并赋给主体数据对应的项内
         this.data.cart[index].product_num = ++this.data.cart[index].product_num;
         // 更新data数据对象
  		var totals = this.data.total;
  		  this.data.total = parseFloat(totals.toFixed(2));
  		
         this.setData({
             cart: this.data.cart,
             total: this.data.total,
             goodsCount: this.data.goodsCount
         })
         // 主体数据重新赋入缓存内
         try {
             wx.setStorageSync('cart', this.data.cart)
         } catch (e) {
             console.log(e)
         }
     },	
  

  /* 减数 */
     delCount: function (e) {
  		//console.log(e)
  		var cart = this.data.cart
  		var index = e.target.id.substring(3);
  		let num = cart[index].product_num;		
  		 //console.log(num)		
        if (num<= 1) {		   
             return;
         } 		
        // 商品总数量-1
         this.data.goodsCount -= 1;
  		 //console.log(this.data.goodsCount)
         // 总价钱 减去 对应项的价钱单价
         this.data.total -= (this.data.cart[index].price);
         // 购物车主体数据对应的项的数量-1  并赋给主体数据对应的项内
         this.data.cart[index].product_num = -- this.data.cart[index].product_num;
  		
  		var totals = this.data.total;
           this.data.total = parseFloat(totals.toFixed(2));
         // 更新data数据对象
  		this.setData({
             cart: cart,
             total: this.data.total,
             goodsCount: this.data.goodsCount
         })
         // 主体数据重新赋入缓存内
         try {
             wx.setStorageSync('cart', cart)
         } catch (e) {
             console.log(e)
         }    	 
     },
  

/* 删除item */
    delGoods: function (e) {
		//console.log(e)
		var index = e.target.id.substring(3);
        // 商品总数量  减去  对应删除项的数量
        this.data.goodsCount = this.data.goodsCount - this.data.cart[index].product_num;
        // 总价钱  减去  对应删除项的单价*数量
        this.data.total -= this.data.cart[index].price * this.data.cart[index].product_num;

        // 主体数据的数组移除该项
        this.data.cart.splice(index, 1);
        // 更新data数据对象	
		var totals = this.data.total;   //解决显示小数点位数过多bug
		  this.data.total = parseFloat(totals.toFixed(2));
		
        this.setData({
            cart: this.data.cart,
            total: this.data.total,
            goodsCount: this.data.goodsCount
        }) 	
		
        // 主体数据重新赋入缓存内
        try {
            wx.setStorageSync('cart', this.data.cart)
			
        } catch (e) {
            console.log(e)
        }
    },		
	 
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
     var _self=this;
     _self.setData({
         iscart: false,
         cart: [], //数据
         total: 0,    //总金额
         goodsCount: 0 //数量 
     });
  },
  
  
  Tooder:function(event){
	 console.log(event)
	 //var order_info = event.currentTarget.dataset.cart;
	
	 var total_price = event.currentTarget.dataset.total;
	 var order_num = event.currentTarget.dataset.count;
	 wx.navigateTo({
	   url: '../order/order?total_price=' + total_price +'&order_num=' + order_num
	 })
	 
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