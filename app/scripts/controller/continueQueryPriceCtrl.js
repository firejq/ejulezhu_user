/**
 * Created by firejq on 2017-10-20.
 */
'use strict';

angular.module('app').controller('continueQueryPriceCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	//$scope.orderId = $state.params.orderId;
	//$scope.orderNo = $state.params.orderNo;

	var imgInfoList = [];//已上传到服务器的所有图片的信息列表
	$scope.queryReason = '';


	//监听上传按钮，选中文件即触发
	$("#continue-query-price-pic").on("change", function(e){
		if (typeof e.target.files[0] !== 'undefined') {
			var file = e.target.files[0]; //获取图片资源
			var reader = new FileReader();
			reader.readAsDataURL(file); // 读取文件
			// 渲染文件
			reader.onload = function(arg) {
				var img = '<img class="continue-query-price-pic-preview" src="' + arg.target.result + '" alt="preview"/>';
				$("#continue-query-price-pic-insert-label").before(img);
				console.log('sss');
			};

			//上传图片
			var img_form = new FormData();
			img_form.append('File', file);
			img_form.append('Mobileno', cache.get('Mobileno'));
			img_form.append('Token', cache.get('Token'));
			img_form.append('Reqtime', Math.round(new Date().getTime()/1000));

			$http({
				url: $scope.global.url + 'image/upload',
				method: 'POST',
				data: img_form,
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity
			}).then(function (response) {

				//console.log(response);
				if (response.data.Status === 0) {
					//console.log('upload successfully');

					//获取服务器回调信息：图片Id和外链地址，并存储到 imgInfoList 中
					imgInfoList.push({
						Id: response.data.Id,
						Url: $scope.global.imagesServer + response.data.Url
					});

					//若选择图片数量到达4张，不再允许添加图片
					if (imgInfoList.length >= 4) {
						document.getElementById('continue-query-price-pic-insert-label').style.display='none';
					}

				} else {
					$scope.global.msg('图片上传出错');
				}
			}, function (response) {
				console.log('fail! ' + response);
				$scope.global.msg('连接超时');
			});
		}
	});



	/**
	 * 提交继续询价
	 */
	$scope.continueQueryPriceSubmit = function () {

		if ($scope.queryReason === '') {
			$scope.global.msg('原因不能为空~');
			return;
		}

		var imageIds = '';
		for (var i = 0, len = imgInfoList.length; i < len; i ++) {
			if (i === 0) {
				imageIds += imgInfoList[i].Id;
				continue;
			}
			imageIds += ',' + imgInfoList[i].Id;
		}

		/**
		 * 提交继续询价数据
		 * TODO 未测试
		 */
		$http({
			method: 'GET',
			url: $scope.global.url + 'order/confirmpricing',
			params: {
				Mobileno: mobilenoCookie,
				Token: tokenCookie,
				Usertype: 1,
				Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
				Orderno: $state.params.orderNo,
				Orderid: $state.params.orderId,
				Accepted: 0,
				Reason: $scope.queryReason,
				Image: imageIds
			}
		}).then(function (response) {
			//console.log(response);
			if (response.data.status === 0) {
				$scope.global.msg('提交成功');
				$state.go('myOrder');
			} else {
				$scope.global.msg('提交出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
		});

	};
}]);