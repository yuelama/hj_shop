// hj_shop/pages/editaddr/editaddr.js
 import {
  areaData
} from "../../../components/area.js" 
/* import Toast from '../../../miniprogram_npm/@vant/weapp/toast/index'; */



let apps = getApp();
var form;
Page({

  /**
   * 页面的初始数据
   */
  data: {
   form: {
     id: "",
     name: "",
     mobile: "",
     address: "",
     street: "",
     isDefault: 2  //1:true 2:false
   },
   show: false,
	areaList: areaData,
	editaddr: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
     //console.log(e)
	wx.setNavigationBarTitle({
	  title: '编辑地址',
	})
	
	 if(e.editaddr == "true"){
		 this.setData({
		 editaddr:true,
		 'form.id': e.id,
		 'form.name': e.name,
		 'form.mobile': e.mobile,
		 'form.address': e.address,
		 'form.street': e.street
		 })
	 }else if(e.import == "true"){
		 this.setData({
		 editaddr:false,
		 'form.id': e.id,
		 'form.name': e.name,
		 'form.mobile': e.mobile,
		 'form.address': e.address,
		 'form.street': e.street
		 })
	   }	
	 
	  if (e.isDefault == "true") {
	    this.setData({
	      'isDefault': 1
	    })
	  } else {
	    this.setData({
	      'isDefault': 2
	    })
	  }	 
	//this.loadAddr()
  },

//选择地点
 /* addressChange: function (e) {
    this.addressChoose(e);
  },
 addressChoose: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address: res.name,
          longitude: res.longitude, //经度
          latitude: res.latitude,//纬度
        })
        if (e.detail && e.detail.value) {
          this.data.address = e.detail.value;
        }
      },
      fail: function (e) {
      },
      complete: function (e) {
      }
    })
  }, */
	
 changeDefault: function (e) {
    this.setData({
      'isDefault': e.detail
    })
  },
  
  importAddress: function () {
    let that = this;
    wx.chooseAddress({
      success(res) {
        that.setData({
          'form.name': res.userName,
          'form.mobile': res.telNumber,
          'form.address': res.provinceName + " " + res.cityName + " " + res.countyName,
          'form.street': res.detailInfo
        })
      }
    })
  },
  
  onSelectAddress: function (e) {
    this.setData({
      show: true
    })
  },
  
  cancelSelect: function () {
    this.setData({
      show: false
    })
  },
  
  onChangeName: function (e) {
    this.setData({
      'form.name': e.detail
    })
  },
  onChangeMobile: function (e) {
    this.setData({
      'form.mobile': e.detail
    })
  },
  
  showSelectAddress: function (e) {
    this.setData({
      show: true
    })
  },
  
  
  onChangeStreet: function (e) {
    this.setData({
      'form.street': e.detail
    })
  },
  
  changeDefault: function (e) {
    this.setData({
      'form.isDefault': e.detail
    })
  },
  
  cancelSelect: function () {
    this.setData({
      show: false
    })
  },
  
 selectArea: function (e) {
	 //console.log(e)
    let v = e.detail.values;
    let data = v[0].name + " " + v[1].name + " " + v[2].name;
    this.setData({
      'address': data,
      show: false
    })
	
  }, 


saveAddress: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; //上一个页面
    let data = prevPage.data.addressList;
    let that = this;
    if (this.data.editaddr) {
      // 编辑
      data.forEach(function (v, index) {
        if (v.id == that.data.form.id) {
          data[index] = that.data.form;
        }
      })
    } else {
      // 添加
      data.push(this.data.form)
    }
    
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      addressList: data
    })
    Toast.success({
      duration: 0,
      message: '保存成功',
    }); 
	
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 1000)

  },
  
 loadAddr:function(){
 	let that = this;
    // let addr_data = this.data.form;
	 console.log(form.name)
	 
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