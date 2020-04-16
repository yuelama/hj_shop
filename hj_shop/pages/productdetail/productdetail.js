// hj_shop/pages/productdetail/productdetail.js
let apps = getApp();
var productdetail = [];
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
		bandetail: [], //轮播图片数据
		viewpic:'',
		
		k:[],
		skuinfo:[],
		sku_id:'',
		//判断部分
		//isLogin: false,
		couponShow: false,
		serviceShow: false,

		//productdetail: [], //产品细节数据
		productid: '',
		payid: '',

		openid: '',

		detail_price: '',
		detail_title: '',
		detail_num: '',
		detail_pic: '',
		preview_img:"",
		tags: [{
		  id: 1,
		  title: "种植基地新出品种"
		},
		{
		  id: 2,
		  title: "最近热销品种"
		}
		],
	
	  kweigt:[],
	  
	  show: false, // 显示属性规格
	  noneSku: false, // 有无规格选择
	  quota: 100, // 限购数量
	  productId: 1, // 商品id
	  picUrl: "", // 当前选择图片
	  specText: "", // 所选规格属性
	  specTextNoCount: "", // 所选规格属性 无数量
	 
	  // 选择的 sku 组合
	  selectedSku: {
	  },
	  count: 1 // 选择的商品数量
	
	
		
	},
		
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		//console.log(options)
		let productid = options.id;
		///console.log(options)
		this.setData({
			productid:productid
		})
		var that = this;
		apps.util.request({
			'url': 'entry/wxapp/Productdetail',
			header: {
				'content-type': 'application/json'
			},
			data: {
				id: productid,
			},
			success(res) {
				//console.log(res)			
				that.setData({
					productdetail: res.data.data.details
				})
			}

		})
		this.skudata();
	},

/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		
      
	},

// 获取初始化商品规格配置数据信息
skudata:function(e){
	//console.log(e)
	var that = this;
	  var sku_id = this.data.productid;
	//console.log(sku_id) 	
	apps.util.request({
		'url': 'entry/wxapp/weigt',
		header: {
			'content-type': 'application/json'
		},
		data: {
			id: sku_id,
		}, 
		success(res) {
			console.log(res)
			var k=[];
			for(var i=0;i<res.data.data.weigtdatas.length;i++){
				k[i] = res.data.data.weigtdatas[i]
			}
			
			 var v = [];
			for(var j=0;j<res.data.data.weigtdatas.length;j++){
				v[j] = res.data.data.weigtdatas[j].weigt
			} 
			console.log(k)
			 that.setData({
				skuinfo: k,
				kname:k[0].weigt_name,
				kweigt:v
			})
		}
	
	})
	 
 }, 

  openCoupon: function () {
    this.setData({
      couponShow: true
    })
  },
 
 closeCoupon: function () {
   this.setData({
     couponShow: false
   })
 },
 
 openAddress: function () {
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

 openService: function () {
   this.setData({
     serviceShow: true
   })
 },
 
 closeService: function () {
   this.setData({
     serviceShow: false
   })
 },

 previewThumb: function (e) {
	//console.log(e)	
   var viewpic = this.data.productdetail[0].img;
  // console.log(viewpic)
 wx.previewImage({
      current: viewpic,
      urls: [viewpic]
    }) 
  },

showSku: function (e) {
	
    this.setData({
      'show': true
    })
  },
  closeSku: function (e) {
    this.setData({
      'show': false
    })
  },
  
  clickTag: function (e) {
    let v = e.currentTarget.dataset.value;
    wx.navigateTo({
      url: '/hj_shop/pages/promotion/promotion?id=' + v.id + '&title=' + v.title
    });
  },
  
  
  toComment: function () {
    wx.navigateTo({
      url: '/hj_shop/pages/comment/comment?productId' + this.data.product.id,
    })
  },
  
  toVip: function(){
    wx.navigateTo({
      url: '/hj_shop/pages/vip/vip',
    })
  },

 
  /* 选择购买份量 规格 */
  selectSku: function (e) {
    /* let k = e.currentTarget.dataset.k;
    let v = e.currentTarget.dataset.value;
    let index = e.currentTarget.dataset.index;
    let iindex = e.currentTarget.dataset.iindex; */
	
	//console.log(options)	
    if (this.data.tree[index].v[iindex].disabled) {
      return;
    }
    // 勾选或反选 设置属性
    if (!this.data.tree[index].v[iindex].selected) {
      // 勾选 记录
      let s = 'selectedSku.' + k.ks;
      this.setData({
        [s]: v.id
      });
    } else {
      // 反选 删除值
      let s = 'selectedSku.' + k.ks;
      this.setData({
        [s]: ''
      });
    } 	
    this.setData({
      [`tree[${index}].v[${iindex}].selected`]: !this.data.tree[index].v[iindex].selected
    });
    // 排除该组其他已选项
    let vList = this.data.tree[index].v;
    for (let i = 0; i < vList.length; i++) {
      if (vList[i].id != v.id) {
        this.setData({
          [`tree[${index}].v[${i}].selected`]: false
        })
      }
    }
    this.judgeAllItem();
    // 修改属性图片
    if (index == 0) {
	  this.setData({
	    'product.picUrl': this.data.tree[0].v[iindex].picUrl
	  })
    }
    // 修改选择商品价格信息
    if (this.isAllSelected()) {
      let skuComb = this.getSkuComb();
      this.setData({
        'product.price': skuComb.price
      })
    } else {
      // 恢复默认价格
      this.setData({
        'product.price': this.data.product.defaultPrice
      })
    }
  },



// 循环判断所有属性是否可选
  judgeAllItem: function () {
    // 判断库存
    let tree = this.data.tree;
    for (let i = 0; i < tree.length; i++) {
      let v = tree[i].v;
      for (let j = 0; j < v.length; j++) {
        if (this.isSkuChoosable(tree[i].ks, v[j].id)) {
          // 可点击
          this.setData({
            [`tree[${i}].v[${j}].disabled`]: false
          })
        } else {
          // 不可点击
          this.setData({
            [`tree[${i}].v[${j}].disabled`]: true
          })
        }
      }
    }
    this.getSelectedText();
  },



isSkuChoosable: function (ks, vId) {

    let selectedSku = this.data.selectedSku;
    let list = this.data.list;

    // 先假设sku已选中，拼入已选中sku对象中
    let matchedSku = Object.assign({}, selectedSku, {
      [ks]: vId
    });

    // 再判断剩余sku是否全部不可选，若不可选则当前sku不可选中
    let skusToCheck = Object.keys(matchedSku).filter(
      skuKey => matchedSku[skuKey] != ''
    );

    let filteredSku = list.filter(sku => (
      skusToCheck.every(
        skuKey => String(matchedSku[skuKey]) == String(sku[skuKey])
      )
    ));

    let stock = filteredSku.reduce((total, sku) => {
      total += stockNum;
      return total;
    }, 0);
    return stock > 0;
  },
  
  // 是否所有规格已选
  isAllSelected: function () {
    let selectedSku = this.data.selectedSku;
    let selected = Object.keys(selectedSku).filter(
      skuKeyStr => selectedSku[skuKeyStr] != ""
    );
    return this.data.tree.length == selected.length;
  },
  // 获得已选择的组合
  getSkuComb: function () {
    if (!this.isAllSelected()) {
      return {};
    }
    let selectedSku = this.data.selectedSku;
    let list = this.data.list;
    let skusToCheck = [];
    this.data.tree.forEach(v => {
      skusToCheck.push(v.ks)
    })
    let filteredSku = list.filter(sku => (
      skusToCheck.every(
        skuKey => String(selectedSku[skuKey]) == String(sku[skuKey])
      )
    ));
    return filteredSku[0];
  },

 // 选择属性文字
  getSelectedText: function () {
    let selectedSku = this.data.selectedSku;
    let text = "";
    Object.keys(selectedSku).forEach(
      skuKeyStr => {
        let id = selectedSku[skuKeyStr];
        let tree = this.data.tree;
        for (let i = 0; i < tree.length; i++) {
          let v = tree[i].v;
          for (let j = 0; j < v.length; j++) {
            if (v[j].id == id) {
              text = text + ' ' + v[j].name
            }
          }
        }
      }
    )
    this.setData({
      'specTextNoCount': text
    })
    if (this.isAllSelected()) {
      text = text + ' ×' + this.data.count;
    }
    this.setData({
      'specText': text
    })
  },
  
  changeCount: function (e) {
    this.setData({
      'count': e.detail.value
    });
    this.getSelectedText();
  },
  
  // 未选择属性提示
  toChooseTip: function () {
    // 未选择规格属性
    if (!this.data.show) {
      // 未显示选择面板则显示
      this.setData({
        'show': true
      })
      return;
    }
    let selectedSku = this.data.selectedSku;
    let skuNotChoose = Object.keys(selectedSku).filter(
      skuKeyStr => selectedSku[skuKeyStr] == ''
    )[0]
    this.data.tree.forEach(v => {
      if (v.ks == skuNotChoose) {
        Toast("请选择：" + v.k);
      }
    })
  },
  

   Tocart: function(event) {
		this.setData({
			toastHidden: false
		});
		for (var i in this.data.productdetail) {
			if (this.data.productdetail[i].id == event.currentTarget.dataset.productid) {
				this.joinT();
				this.data.productdetail[i].product_num = 1;
				var arr = wx.getStorageSync('cart') || [];
				if (arr.length > 0) {
					// 遍历购物车数组				
					for (var j in arr) {
						// 判断购物车内的item的id，和事件传递过来的id，是否相							
						if (arr[j].id == event.currentTarget.dataset.productid) {
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
				else {
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
	},

	/* onPullDownRefresh(){
	
} */

	Tobuy: function(event) {
		console.log(event)
		var that = this;
		var openid = wx.getStorageSync('userid');
		if ('openid') {
			for (var i in this.data.productdetail) {
				if (this.data.productdetail[i].id == event.currentTarget.dataset.productid) {
					var detail_price = this.data.productdetail[i].price;
					var detail_title = this.data.productdetail[i].product_name;
					var detail_num = this.data.productdetail[i].product_num;
					var detail_pic = this.data.productdetail[i].img;
				}
				wx.navigateTo({
					url: '../detail_order/detail_order?detail_price=' + detail_price + '&detail_num=' + detail_num +
						'&detail_title=' + detail_title + '&detail_pic=' + detail_pic
				})
			}

		} else {
			wx.switchTab({ //请登录
				url: "/hj_shop/pages/login/login"
			})
		}
	},


	joinF: function() {
		wx.showModal({
			title: '提示',
			content: '请勿重复添加',

		})
	},

	joinT: function() {
		wx.showModal({
			title: '提示',
			content: '是否添加商品',
		})

	},


	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
	openIndexPage: function() {
		wx.switchTab({
			url: '/hj_shop/pages/index/index',
		})
	},
	/* openCoupon: function () {
	  this.setData({
	    couponShow: true
	  })
	},
	closeCoupon: function () {
	  this.setData({
	    couponShow: false
	  })
	},
	openAddress: function () {
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
	openService: function () {
	  this.setData({
	    serviceShow: true
	  })
	},
	closeService: function () {
	  this.setData({
	    serviceShow: false
	  })
	}, */
	openCartPage: function() {
		wx.switchTab({
			url: '/hj_shop/pages/cart/cart',
		})
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
