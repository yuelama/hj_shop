let apps =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseMode: false,
	//isDefault: true,
	checked: false,
  
	addr_info:[],
	del_id:'',
	
	addressList: [],
	 addressdata:{},
	 
	isDefault:false,  //1:true 2:false
	address:false
  
	
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
	 
	  console.log( options) 
	   
	   
	 if (options.chooseMode == "true") {
	   this.setData({
	     chooseMode: true
	   })
	   
		let that = this;
		
		//让传过来的参数 与现有数据库对比 如果ID相同就取出，并设置checke为true
	     this.data.addressList.forEach(function (v, index) {
	       if (options.addressId == v.id) {
	         that.setData({
	           [`addressList[${index}].checked`]: true
	         });
	       }
	     }) 
		 
		 
		   
	   }
  
  },
  
 /* getaddrinfo:function(){
	  
  }, */
  

 /* loadAddr:function(){
	let that = this;
     let data = wx.getStorageSync("address") ;
	// console.log(data)
	 let addr =  data.provinceName+ " " + data.cityName + " " + data.countyName;
		apps.util.request({
		  'url': 'entry/wxapp/Addaddress',
		  header: {
		    'content-type': 'application/json' // 默认值
		  }, 
		  data:{
			  name:data.userName,
			  mobile:data.telNumber,
			  address: addr,
			   street: data.detailInfo,
			  postcode:data.postalCode,
			   openid:wx.getStorageSync('userid')
		    },
		  success(res) {
				wx.removeStorageSync('address');
										
			  }
	})
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
	 // console.log(e)
 	 //this.getaddrinfo()
	 let that = this; 
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
	    							wx.setStorageSync("addressdata",that.data.addressList)
	    					}
	    				})
	 
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
	// console.log(e)
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
		  
		   that.onShow()
		    
		  }
	   })	
	/* console.log(address)
    wx.navigateTo({
      url: '/hj_shop/pages/editaddr/editaddr?editaddr=true&id=' + data.id + '&name=' + data.express_name + '&mobile=' + data.express_tel + '&address=' + address + '&detail=' + data.express_detail + '&isDefault=' + this.data.isDefault
    }) */
 },
 
 editAddress: function (e) {
   console.log(e)
   let data = e.currentTarget.dataset.value;
 //  console.log(data)
   wx.navigateTo({
     url: '/hj_shop/pages/editaddr/editaddr?editaddr=true&id=' + data.id + '&name=' + data.user_name + '&mobile=' + data.user_mobile + '&address=' + data.user_address + '&street=' + data.user_street + '&isDefault=' + data.isDefault
   })
 },
 
 
 
 addAddress: function () {
  let that = this;
  wx.navigateTo({
  	 	    url: '/hj_shop/pages/editaddr/editaddr',
			})
/*  wx.chooseAddress({
    success:res=> {		        
  		let addr = res.provinceName+ " " + res.cityName + " " + res.countyName;
  		wx.navigateTo({
  			 	    url: '/hj_shop/pages/editaddr/editaddr?editaddr=true&name=' + res.userName + '&mobile=' + res.telNumber + '&addr=' + addr + '&street=' + res.detailInfo + '&postcode=' + res.postalCode +'&isDefault=' + this.data.isDefault
  		})
            
    } 
  })*/
 },
 
  importAddress: function () {
	  let that = this;	  
    wx.chooseAddress({
      success:res =>{
		  let address = res.provinceName+ " " + res.cityName + " " + res.countyName;
		  wx.navigateTo({
		  	 	    url: '/hj_shop/pages/editaddr/editaddr?import=true&name=' + res.userName + '&mobile=' + res.telNumber + '&address=' + address + '&street=' + res.detailInfo + '&postcode=' + res.postalCode +'&isDefault=' + this.data.isDefault
		  })
	  }
    }) 
  },
  
  chooseAddress: function (e) {
    if (this.data.chooseMode) {
      let address = e.currentTarget.dataset.value;
  
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];  //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        address: address
      })
      wx.navigateBack({
        delta: 1,
      })
    }
  }
 
})