/**
 * Created by firejq on 2017-10-22.
 */
'use strict';

angular.module('app').controller('overallDecorationSubmitCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	$scope.bookingSubmitData = {
		stylePrice: 0,//每平方价格
		stylePriceTitle: '',//费用类型
		styleTitle: '',//风格名称
		address: '',//地址
		addrId: 0,//地址Id
		appointmentTime: '',//预约服务时间
		roomArea: '',//房屋面积
		roomNum: [//房间数量
			{
				name: 'bedRoomNum',
				value: 0
			},
			{
				name: 'livingRoomNum',
				value: 0
			},
			{
				name: 'kitchenRoomNum',
				value: 0
			},
			{
				name: 'bathRoomNum',
				value: 0
			}
		],
		imgInfoList: [],//上传图片信息
		voiceId: '',//语音文件id
		total: 0//装修估价
	};

	/**
	 * 加减按钮触发函数
	 * @param valIndex
	 */
	$scope.add = function (valIndex) {
		$scope.bookingSubmitData.roomNum[valIndex].value++;
	};
	$scope.minu = function (valIndex) {
		if ($scope.bookingSubmitData.roomNum[valIndex].value > 0) {
			$scope.bookingSubmitData.roomNum[valIndex].value--;
		}
	};
	/**
	 * 总价估价按钮触发函数
	 */
	$scope.evaluate = function () {
		if ($scope.bookingSubmitData.roomArea === '') {
			$scope.global.msg('请输入房屋面积');
			return;
		}
		$scope.bookingSubmitData.total = $scope.bookingSubmitData.roomArea * $scope.bookingSubmitData.stylePrice;
	};



	/**
	 * 获取所有装修风格
	 */
	$http({
		url: $scope.global.url + 'style',
		method: 'GET'
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			//console.log(response.data.records);
			for (var i = 0, len = response.data.records.length; i < len; i ++) {
				if (response.data.records[i].Id.toString() === $state.params.styleId) {
					$scope.bookingSubmitData.styleTitle = response.data.records[i].Title;
					break;
				}
			}

		} else {
			$scope.global.msg('信息获取出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});


	/**
	 * 获取指定风格的各阶层价格信息
	 */
	$http({
		url: $scope.global.url + 'style/price',
		method: 'GET',
		params: {
			Id: $state.params.styleId
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			//console.log(response.data.records);
			for (var i = 0, len = response.data.records.length; i < len; i ++) {
				if (response.data.records[i].Id.toString() === $state.params.stylePriceId) {
					//console.log(response.data.records[i]);
					$scope.bookingSubmitData.stylePriceTitle = response.data.records[i].Introduction;
					$scope.bookingSubmitData.stylePrice = response.data.records[i].Price;
					break;
				}
			}
		}

	}, function (response) {
		console.log('fail! ' + response);
	});


	/**
	 * 获取默认地址
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'fixaddress/request',
		params: {
			Mobileno: mobilenoCookie,
			Usertype: 1,
			Token: tokenCookie,
			Reqtime: Math.round(new Date().getTime()/1000)
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			for (var i = 0; i < response.data.records.length; i ++) {
				if (response.data.records[i].IsDefaultaddr === 1) {
					//console.log(response.data.records[i]);
					$scope.bookingSubmitData.address = response.data.records[i].Region + response.data.records[i].Contactaddr;
					$scope.bookingSubmitData.addrId = response.data.records[i].Id;
					break;
				}
			}
			//console.log($scope.bookingSubmitData.address);
		} else {
			$scope.global.msg('获取地址失败');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});



	//存储当前放大预览的图片的id
	$scope.currentPreviewImgId = '';
	/**
	 * 预览图片点击的回调函数
	 * 全屏显示、显示删除按钮
	 */
	var previewImgClick = function (event) {
		$scope.currentPreviewImgId = event.target.id;
		$scope.showModal();//显示遮罩层

	};

	/**
	 * 显示遮罩层同时放大图片
	 */
	$scope.showModal = function () {
		document.getElementById('preview-img-modal').style.display = 'block';
		document.getElementById($scope.currentPreviewImgId).classList.add('img-upload-preview-clicked');

	};
	/**
	 * 隐藏遮罩层同时缩小图片
	 */
	$scope.hideModal = function () {
		document.getElementById('preview-img-modal').style.display = 'none';
		document.getElementById($scope.currentPreviewImgId).classList.remove('img-upload-preview-clicked');

	};

	/**
	 * 取消上传图片
	 */
	$scope.cancelUploadImg = function () {
		$scope.hideModal();
		document.getElementById($scope.currentPreviewImgId).style.display = 'none';
		for (var i = 0; i < $scope.bookingSubmitData.imgInfoList.length; i ++) {
			if ($scope.bookingSubmitData.imgInfoList[i].ImgElementId === $scope.currentPreviewImgId) {

				//删除服务器的对应图片
				$http({
					url: $scope.global.url + 'image/delete',
					method: 'GET',
					params: {
						Mobileno: mobilenoCookie,
						Token: tokenCookie,
						Usertype: 1,
						Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
						Id: $scope.bookingSubmitData.imgInfoList[i].Id//图片id
					}
				}).then(function (response) {

					if (response.data.status === 0) {
						//console.log('成功删除');
						$scope.bookingSubmitData.imgInfoList.splice(i, 1);//从数组中删除该元素
						return;
					}

				},function (response) {
					console.log('fail! ' + response);
					$scope.global.msg('连接超时');
				});

				return;
			}
		}


	};


	/**
	 * 图片上传按钮事件监听
	 */
	$("#img-upload").on("change", function(e){
		if (typeof e.target.files[0] !== 'undefined') {
			var file = e.target.files[0]; //获取图片资源
			var nameHash = $scope.global.hashCode(file.name);//根据文件名计算hash值
			var reader = new FileReader();
			reader.readAsDataURL(file); // 读取文件
			// 渲染文件
			reader.onload = function(arg) {
				var img = '<img id="' + nameHash + '-preview-img" class="img-upload-preview" src="' + arg.target.result + '" alt="preview"/>';
				//插入到dom中
				$("#img-upload-insert-label").before(img);
				//注册点击回调
				document.getElementById(nameHash + '-preview-img').addEventListener('click', previewImgClick);
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
					$scope.bookingSubmitData.imgInfoList.push({
						ImgElementId: nameHash + '-preview-img',
						Id: response.data.Id,
						Url: $scope.global.imagesServer + response.data.Url
					});

					//若选择图片数量到达4张，不再允许添加图片
					if ($scope.bookingSubmitData.imgInfoList.length >= 4) {
						document.getElementById('img-upload-insert-label').style.display='none';
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
	 * 语音文件上传监听事件
	 */
	$("#voice-upload").on("change", function(e) {
		if (typeof e.target.files[0] !== 'undefined') {
			var file = e.target.files[0]; //获取语音文件资源

			//上传语音文件
			var voice_form = new FormData();
			voice_form.append('File', file);
			voice_form.append('Mobileno', cache.get('Mobileno'));
			voice_form.append('Token', cache.get('Token'));
			voice_form.append('Reqtime', Math.round(new Date().getTime() / 1000));

			$http({
				url: $scope.global.url + 'voice/upload',
				method: 'POST',
				data: voice_form,
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity
			}).then(function (response) {
				//console.log(response);
				if (response.data.Status === 0) {
					//console.log('upload successfully');
					//获取服务器回调信息：将语音id存储到 $scope.bookingSubmitData.voiceId 中
					$scope.bookingSubmitData.voiceId = response.data.Id;
					//console.log($scope.bookingSubmitData.voiceId);

				} else {
					$scope.global.msg('语音上传出错');
				}
			}, function (response) {
				console.log('fail! ' + response);
				$scope.global.msg('连接超时');
			});
		}
	});


	/**
	 * 提交预约
	 */
	$scope.bookingSubmit = function () {

		if ($scope.bookingSubmitData.appointmentTime === '') {
			$scope.global.msg('请输入预约时间');
			return;
		}


		//格式化图片id字符串
		var imageIds = '';
		for (var i = 0, len = $scope.bookingSubmitData.imgInfoList.length; i < len; i ++) {
			if (i === 0) {
				imageIds += $scope.bookingSubmitData.imgInfoList[i].Id;
				continue;
			}
			imageIds += ',' + $scope.bookingSubmitData.imgInfoList[i].Id;
		}


		/**
		 * 提交预约
		 */
		$http({
			url: $scope.global.url + 'order/place',
			method: 'GET',
			params: {
				Mobileno: mobilenoCookie,
				Token: tokenCookie,
				Usertype: 1,
				Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
				Type: 1,
				ImageId: imageIds,//图片文件id
				VoiceId: $scope.bookingSubmitData.voiceId,//语音文件id
				TotalPrice: $scope.bookingSubmitData.total,
				AddrId: $scope.bookingSubmitData.addrId,//维修地址Id
				AppintmentTime: (new Date($scope.bookingSubmitData.appointmentTime).getTime())/1000,//unix时间戳
				Attact: '',//留言
				Room: $scope.bookingSubmitData.roomNum[0].value,
				Hall: $scope.bookingSubmitData.roomNum[1].value,
				Kitchen: $scope.bookingSubmitData.roomNum[2].value,
				Toilet: $scope.bookingSubmitData.roomNum[3].value,
				Size: $scope.bookingSubmitData.roomArea,
				StyleId: $state.params.styleId,
				StylePriceId: $state.params.stylePriceId
			}
		}).then(function (response) {

			console.log(response);
			if (response.data.Status === 0) {
				$scope.global.msg('您的订单已提交成功，我们将尽快与您取得联系~');
				window.history.back();
			} else {
				$scope.global.msg('提交预约出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
			$scope.global.msg('连接超时');
		});


	};



}]);