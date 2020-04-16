// hj_shop/pages/test_toast/test_toast.js
const app = getApp();
var selectIndex; //选择的大规格key
var attrIndex; //选择的小规格的key
var selectIndexArray = []; //选择属性名字的数组
var selectAttrid = []; //选择的属性id

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		picture: [{
				img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3438576193,3301397209&fm=27&gp=0.jpg'
			},
			{
				img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1525546566,2404337493&fm=27&gp=0.jpg'
			},
			{
				img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3028702483,4182396631&fm=27&gp=0.jpg'
			},
		],
		//swiper相关
		indicatorDots: true,
		autoplay: true,
		interval: 3000,
		duration: 1000,
		circular: true,
		//选择的规格
		num: 1, //初始数量
		amount: 0, //初始金额
		minusStatus: 'disabled', // 使用data数据对象设置样式名
		choose_modal: "block", // 规格数量框
		flag: 0, //点选规格时来源 0：规格点 1：立即购买 2：加入购物车
		//规格数据
		spec: [{
			"id": 1,
			"name": "\u989c\u8272",
			"child": [{
				"id": 11,
				"name": "\u7ea2\u8272",
				"isSelect": true
			}, {
				"id": 111,
				"name": "\u767d\u8272",
				"isSelect": false
			}]
		}, {
			"id": 2,
			"name": "\u5c3a\u7801",
			"child": [{
				"id": 21,
				"name": "\u5c0f\u53f7",
				"isSelect": true
			}, {
				"id": 22,
				"name": "\u5927\u53f7",
				"isSelect": false
			}]
		}],
		selectName: "", //已选的属性名字
		selectAttrid: [], //选择的属性id
		//商品信息
		goods_info: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var that = this;
		wx.request({
			url: app.globalData.host + '/index.php/app/goods/goodsDetails/goods_id/34',
			header: {
				'Content-type': 'application/json'
			},
			success: function(res) {
				console.log(res.data.data.goods_info);
				that.setData({
					goods_info: res.data.data.goods_info,
				});
				that.init_attr();
			}
		})

	},

	/* 点击减号 */
	bindMinus: function() {
		var num = this.data.num;
		// 如果大于1时，才可以减
		if (num > 1) {
			num--;
		}
		// 只有大于一件的时候，才能normal状态，否则disable状态
		var minusStatus = num <= 1 ? 'disabled' : 'normal';
		// 将数值与状态写回
		this.setData({
			num: num,
			minusStatus: minusStatus
		});
		this.change_spec();
		this.change_price();
	},

	bindPlus: function() {
		var num = this.data.num;
		// 不作过多考虑自增1
		num++;
		// 只有大于一件的时候，才能normal状态，否则disable状态
		var minusStatus = num < 1 ? 'disabled' : 'normal';
		// 将数值与状态写回
		this.setData({
			num: num,
			minusStatus: minusStatus
		});
		this.change_spec();
		this.change_price();
	},
	/* 输入框事件 */
	bindManual: function(e) {
		var num = e.detail.value;
		if (isNaN(num)) {
			num = 1;
		}
		// 将数值与状态写回
		this.setData({
			num: parseInt(num)
		});
		this.change_spec();
		this.change_price();
	},
	//弹出
	modal_show: function(e) {
		var flag = e.currentTarget.dataset.flag;
		this.setData({
			flag: flag,
			choose_modal: "block",
		});
	},
	//消失
	modal_none: function() {
		this.setData({
			choose_modal: "none",
		});
	},

	clickAttr: function(e) {
		// console.log(e);return;
		var selectIndex = e.currentTarget.dataset.selectIndex;
		var attrIndex = e.currentTarget.dataset.attrIndex;
		var spec = this.data.spec;
		var count = spec[selectIndex].child.length;
		// console.log(count); return;
		for (var i = 0; i < count; i++) {
			spec[selectIndex].child[i].isSelect = false;
		}
		spec[selectIndex].child[attrIndex].isSelect = true;

		var name = spec[selectIndex].child[attrIndex].name; //点击属性的名称
		var attrid = spec[selectIndex].child[attrIndex].id;
		// //点击过，修改属性
		var selectName = "";
		//点击过，修改属性
		selectIndexArray[selectIndex].value = name;
		selectAttrid[selectIndex] = attrid;
		var selectIndexArraySize = selectIndexArray.length;
		//将数组的所有属性名拼接起来
		for (var i = 0; i < selectIndexArraySize; i++) {
			selectName += ' "' + selectIndexArray[i].value + '" ';
		}
		console.log(selectName);
		this.setData({
			spec: spec, //变换选择框
			selectName: selectName,
			selectAttrid: selectAttrid
		});
	},

	//初始化规格选择
	init_attr: function() {
		//初始化规格选择
		var name = "";
		var spec = this.data.spec;
		var size = spec.length;
		for (var i = 0; i < size; i++) {
			selectIndexArray.push({
				key: i,
				value: spec[i].child[0].name
			});
			selectAttrid.push(spec[i].child[0].id)
			name += ' "' + selectIndexArray[i].value + '" ';
		}
		var selectName = this.data.selectName;
		selectName = name;
		this.setData({
			selectName: selectName,
			selectAttrid: selectAttrid
		});
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
