/**
 * Created by firejq on 2017-10-20.
 */
'use strict';

angular.module('app').controller('payProgressPaymentCtrl', ['$http', '$scope', '$state', 'cache', function ($http, $scope, $state, cache) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	$scope.orderDetail = {};//订单详情信息
	$scope.payProgressPaymentData = {//支付进度款信息
		userPayFee: '',//用户此次支付要支付的金额
		weChatPayParams: {},//存储微信支付请求部分参数
		aliPayParams: {}//存储微信支付请求部分参数
	};




	/**
	 * 获取订单详细信息和状态
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'order/status',
		params: {
			Mobileno: mobilenoCookie,
			Token: tokenCookie,
			Usertype: 1,
			Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
			Orderno: $state.params.orderNo,
			Orderid: $state.params.orderId
		}
	}).then(function (response) {
		if (response.data.Status === 0) {
			//将订单详情赋值到$scope.payProgressPaymentData中
			$scope.orderDetail = response.data;

			//格式化下单时间和预约时间，原格式：20171014092816，格式化为2017-10-14 09:28:16
			var time = $scope.orderDetail.OrderTime;
			$scope.orderDetail.OrderTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' + time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12, 14);
			time = $scope.orderDetail.Appointmenttime;
			$scope.orderDetail.Appointmenttime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' + time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12, 14);

			//console.log($scope.orderDetail);


			/**
			 * 获取订单还没支付的金额
			 */
			$http({
				method: 'GET',
				url: $scope.global.url + 'order/getorderremainingfee',
				params: {
					Mobileno: mobilenoCookie,
					Token: tokenCookie,
					Usertype: 1,
					Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
					Orderno: $state.params.orderNo,
					Orderid: $state.params.orderId
				}
			}).then(function (response) {
				//console.log(response);
				if (response.data.status === 0) {
					//console.log(response.data.fee);
					$scope.orderDetail.Fee = response.data.fee;

					//console.log($scope.orderDetail);

				} else {
					$scope.global.msg('获取信息出错');
				}
			}, function (response) {
				console.log('fail! ' + response);
			});



		} else {
			$scope.global.msg('获取信息出错');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});








	/**
	 * 	点击确认支付的回调函数
	 */
	$scope.confirmPay = function () {

		if ($scope.payProgressPaymentData.userPayFee === '') {
			$scope.global.msg('支付金额不能为空~');
			return;
		}
		if ($scope.payProgressPaymentData.userPayFee > $scope.orderDetail.fee) {
			$scope.global.msg('支付金额大于总金额~');
			return;
		}


		var payMethod = 'weixin';//TODO 暂时将接口写死
		switch (payMethod) {

			case 'weixin': {
				console.log('进入微信支付');

				if($scope.global.code === null) {//TODO
					// https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=4_4
					// https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
					//跳转到微信授权页面
					location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8f87a4579e561e2f&redirect_uri=http%3a%2f%2fapi.firejq.com&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
					return;
				}

				/**
				 * 获取微信支付部分支付请求参数
				 */
				$http({
					url: $scope.global.url + 'pubpay/getpartialpay',
					method: 'GET',
					params: {
						Mobileno: mobilenoCookie,
						Token: tokenCookie,
						Usertype: 1,
						Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
						Orderno: $state.params.orderNo,
						Fee: $scope.payProgressPaymentData.userPayFee,//金额
						Openid: 1234 //微信平台获取的openid TODO
					}
				}).then(function (response) {
					console.log(response);
					if (response.data.status === 0) {
						console.log(response.data);
						$scope.payProgressPaymentData.weChatPayParams = response.data.Payparam;
						console.log('获取支付参数：' + JSON.stringify($scope.payProgressPaymentData.weChatPayParams));



						//调用微信JS API
						//https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6
						//var weixinPayParams = {
						//	"appId": $scope.payProgressPaymentData.weChatPayParams.appid,     //公众号名称，由商户传入
						//	"timeStamp": $scope.payProgressPaymentData.weChatPayParams.timestamp,//时间戳，自1970年以来的秒数
						//	"nonceStr": $scope.payProgressPaymentData.weChatPayParams.noncestr, //随机串
						//	"package": 'prepay_id=' + $scope.payProgressPaymentData.weChatPayParams.prepayid,
						//	"signType": 'MD5', //微信签名方式：
						//	"paySign": $scope.payProgressPaymentData.weChatPayParams.sign //微信签名
						//};
						//console.log(weixinPayParams);
						//var onBridgeReady = function() {
						//	WeixinJSBridge.invoke(
						//		'getBrandWCPayRequest', weixinPayParams, function(res){
						//			WeixinJSBridge.log(res.err_msg);
						//			// writeObj(res);
						//			alert(JSON.stringify(res));
						//			if(res.err_msg === "get_brand_wcpay_request:ok" ) {
						//				// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
						//				//console.log('ok!');
						//				alert('ok');
						//			} else if (res.err_msg === "get_brand_wcpay_request:fail"){
						//				//console.log('fail!');
						//				alert('fail');
						//			} else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
						//				console.log('cancel!');
						//				alert('cancel');
						//			}
						//		});
						//};
						//
						//window.event.returnValue = false;
						//try {
						//	if (typeof WeixinJSBridge === "undefined") {
						//		alert('非微信浏览器！');
						//		if( document.addEventListener ){
						//			document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
						//		}else if (document.attachEvent){
						//			document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
						//			document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
						//		}
						//	}else{
						//		//console.log('defined');
						//		//alert('defined');
						//		onBridgeReady();
						//	}
						//} catch (e) {
						//	alert(e);
						//}




						//调用微信JS API
						//https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
						wx.config({
							debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: $scope.payProgressPaymentData.weChatPayParams.appid, //必填，公众号的唯一标识
							timestamp: $scope.payProgressPaymentData.weChatPayParams.timestamp, //必填，生成签名的时间戳
							nonceStr: $scope.payProgressPaymentData.weChatPayParams.noncestr, // 必填，生成签名的随机串
							signature: $scope.payProgressPaymentData.weChatPayParams.sign,// 必填，签名
							jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
						});

						wx.ready(function() {
							console.log('接口config验证成功');
							alert('接口config验证成功');

							wx.chooseWXPay({
								timestamp: $scope.payProgressPaymentData.weChatPayParams.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
								nonceStr: $scope.payProgressPaymentData.weChatPayParams.noncestr, // 支付签名随机串，不长于 32 位
								package: 'prepay_id=' + $scope.payProgressPaymentData.weChatPayParams.prepayid, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
								signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
								paySign: $scope.payProgressPaymentData.weChatPayParams.sign, // 支付签名
								success: function (res) {
									// 支付成功后的回调函数
									alert(JSON.stringify(res));
									alert('ok');
								},
								fail: function (res) {
									alert(JSON.stringify(res));
									alert('fail');
								},
								complete: function (res) {
									alert(JSON.stringify(res));
									alert('complete');
								}
							});
						});
						wx.error(function(res){
							console.log('接口config验证错误');
							console.log(res);
						});



					}

				}, function (response) {
					console.log('fail! ' + response);
				});




				break;
			}


			case 'ali': {

				/**
				 * 获取支付宝支付部分请求参数
				 */
				$http({
					url: $scope.global.url + 'alipay/getpartialpay',
					method: 'GET',
					params: {
						Mobileno: mobilenoCookie,
						Token: tokenCookie,
						Usertype: 1,
						Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
						Orderno: $state.params.orderNo,
						Fee: $scope.payProgressPaymentData.userPayFee//金额
					}
				}).then(function (response) {
					//console.log(response);
					if (response.data.status === 0) {
						//console.log(response.data);
						$scope.payProgressPaymentData.aliPayParams = response.data.Payparam;
						console.log($scope.payProgressPaymentData);


					//	TODO 调用支付宝API


					}
				}, function (response) {
					console.log('fail! ' + response);
				});


				break;
			}


			default: {
				console.log('default');
				return;
			}
		}
















	};






}]);