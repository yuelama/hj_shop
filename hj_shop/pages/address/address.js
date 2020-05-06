// pages/address/index/index.js
let apps =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseMode: false,
	//isDefault: true,
	checked: false,
    addressList:[],
	addr_info:[],
	del_id:'',
	
	/* express_name:"",
	express_tel:'',
	express_addr:"",
	express_street:"",
	express_postcode:'', */
    isDefault:false
	
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	var that =this;
	apps.util.request({
	  'url': 'entry/wxapp/GetAddr',
	  header: {
	    'content-type': 'application/json' // 默认值
	  }, 	    
	  success(res) { 
		 // console.log(res)
		       var addrs = [];
		    	for (var i = 0; i < res.data.data.length; i++) {					
		    		  addrs[i] = res.data.data[i]	    		  				
		    		   } 
						that.setData({
							addressList:addrs
						})					   
				}
			})
	//this.getAddress();
  },

/* loadAddr:function(){
	
}, */


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
 	
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

  },
  
 /* deleteAddress: function (e) {
    let id = e.currentTarget.dataset.value.id;
    let data = [];
    this.data.addressList.forEach(function (v) {
      if (id != v.id) {
        data.push(v);
      }
    })
    this.setData({
      addressList: data
    })
  }, */
  
  deleteAddr: function (e) {
	 //console.log(e)
	 let data = e.currentTarget.dataset.value;
	 
	let that = this;
	var openid = wx.getStorageSync('userid');
	apps.util.request({
	  'url': 'entry/wxapp/Deladdress',
	  header: {
	    'content-type': 'application/json' // 默认值
	  }, 
	  data:{		 
		 del_id:data.id	
	  
	  },
	  success(res) {
		  
		   that.onLoad();
		    
		  }
	   })	
	/* console.log(address)
    wx.navigateTo({
      url: '/hj_shop/pages/editaddr/editaddr?editaddr=true&id=' + data.id + '&name=' + data.express_name + '&mobile=' + data.express_tel + '&address=' + address + '&detail=' + data.express_detail + '&isDefault=' + this.data.isDefault
    }) */
 },
  
  /* addAddress: function () {
      let that = this;
       var addr_info = wx.getStorageSync("addr_info");
      // console.log(addr_info)
       let express_addr =  addr_info.provinceName+ " " + addr_info.cityName + " " + addr_info.countyName;
			   
   	   apps.util.request({
   	     'url': 'entry/wxapp/Addaddress',
   	     header: {
   	       'content-type': 'application/json' // 默认值
   	     }, 
   	     data:{
   	   	express_name:addr_info.userName,
   	   	express_tel:addr_info.telNumber,
   	   	express_addr:express_addr,
   	   	express_street:addr_info.detailInfo,
   	   	express_postcode:addr_info.postalCode,
   	   		openid:wx.getStorageSync('userid')
   	     },
   	     success(res) {
   	   	   //  console.log(res)
   	   	   wx.chooseAddress({
   	   	     success(res) {
   	   	   	 that.setData({
   	   	   		  address:res
   	   	   	  })   
   	   	      // wx.setStorageSync("addr_info", res);
   	   	       } 		  
   	   		}) 
			// wx.removeStorageSync("addr_info")
        }
	})
  },*/
  
 
 
 importAddress: function () {
	var that = this;
    wx.chooseAddress({
      success(res) {
		 that.setData({
			  address:res
		  })   
	 
        } 
		
    })
		
},
  
  chooseAddress: function (e) {
	 // console.log(e)
   var that = this;
     wx.chooseAddress({
		 success:res =>{
			 console.log(res)
		 }
	 })
	// wx.setStorageSync("addr_info", res);
	} 
})