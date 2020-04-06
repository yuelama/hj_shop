// hj_shop/pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     orderinfo:[],
	 order_num:'',
	 total_price:'',
	 orders:[],
	  address: {},
	  hasAddress: false
	
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	 // console.log(options)
	 var orderinfo = wx.getStorageSync('cart')
	 // console.log(orderinfo)
	 //for(var i=0;i<this.data.index.length) 
    // var product_name = this.data.orderinfo.index[i].product_name;
	  this.setData({
		  order_num:options.order_num,
		  total_price:options.total_price,
		  orders:orderinfo
	  })

		
  },

ToPay:function(){
  var that = this
    if (that.data.hasAddress) {
      // 地址信息
      console.log(that.data.address)
      // 总价信息
      //console.log(that.data)

     
       // var openid = that.data.openid

      } else{
        wx.chooseAddress({
			success:res=>{
				this.setData({
					address:res
				})
			}
		})
    }
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