/**
 * Created by firejq on 2017-10-24.
 */
'use strict';

angular.module('app').controller('repairBookingCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');


	$scope.furnitureRepairSubmitData = {
		fixType: '',//已选择维修类型，多个用逗号分隔
		materialPrices: [],//已选择类型对应的所有维修材料，每一种材料包括描述、单价、Id、单位
		labourPrices: [],//已选择类型对应的所有人工费，每一种人工费包括描述、单价、Id
		selectedMaterial: [],//已选择的维修材料（Id和数量)，如[{materialId:1,number:2}, {materialId:2,number:1}]
		selectedLabour: [],//已选择的维修人工费（Id和数量），如[{labourId:1,number:2}, {labourId:2,number:1}]
		appointTime: '',//上门时间
		addrId: 0,//地址Id
		address: '',//地址
		imgInfoList: [],//上传图片信息
		voiceId: '',//语音文件id
		total: '',//装修估价
		attact: '',//用户留言
	};
	//格式化“维修类型”，用于在页面显示，原格式：xxx,xxx 目标格式：xxx xxx
	for (var i = 0, len = $state.params.types.split(',').length; i < len; i++) {
		$scope.furnitureRepairSubmitData.fixType += $state.params.types.split(',')[i] + ' ';
	}


	/**
	 * 总价估价按钮触发函数
	 */
	$scope.evaluate = function () {
		//TODO
	};



	/**
	 * 获取指定维修类型的详细报价信息：物料、人力单价
	 */
	$http({
		url: $scope.global.url + 'price/request',
		method: 'GET',
		params: {
			Fixtype: $state.params.types//维修类型，多个用英文逗号分隔，注意不能有空格
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {

			//遍历各个类型对应的工种价格信息，为设计好的数据结构赋值
			for (var keyName in response.data) {
				if (keyName !== 'status') {

					$scope.furnitureRepairSubmitData.materialPrices.push({
						typeName: keyName,//维修类型名称
						kinds: []//该类型拥有的所有种类
					});
					//计算数组的最后一项的索引，即当前 keyName 对应的项
					var lastIndexOfMaterial = $scope.furnitureRepairSubmitData.materialPrices.length - 1;
					for (var i = 0, len = response.data[keyName].materialprices.length; i < len; i++) {
						$scope.furnitureRepairSubmitData.materialPrices[lastIndexOfMaterial].kinds.push({
							describe: response.data[keyName].materialprices[i].Desc,
							id: response.data[keyName].materialprices[i].Id,
							price: response.data[keyName].materialprices[i].Price,
							unit: response.data[keyName].materialprices[i].Unit
						});
					}


					$scope.furnitureRepairSubmitData.labourPrices.push({
						typeName: keyName,//维修类型名称
						kinds: []//该类型拥有的所有种类
					});
					//计算数组的最后一项的索引，即当前 keyName 对应的项
					var lastIndexOfLabour = $scope.furnitureRepairSubmitData.labourPrices.length - 1;
					for (var i = 0, len = response.data[keyName].labourprices.length; i < len; i++) {
						$scope.furnitureRepairSubmitData.labourPrices[lastIndexOfLabour].kinds.push({
							describe: response.data[keyName].labourprices[i].Desc,
							id: response.data[keyName].labourprices[i].Id,
							price: response.data[keyName].labourprices[i].Price
						});
					}
				}
			}


			console.log($scope.furnitureRepairSubmitData);

		} else {
			$scope.global.msg('获取信息出错');
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
					$scope.furnitureRepairSubmitData.address = response.data.records[i].Region + response.data.records[i].Contactaddr;
					$scope.furnitureRepairSubmitData.addrId = response.data.records[i].Id;
					break;
				}
			}
			//console.log($scope.bookingSubmitData.address);
		} else {
			$scope.global.cancel('获取地址失败');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});



	/**
	 * 图片上传按钮事件监听
	 */
	//监听上传按钮，选中文件即触发
	$("#img-upload").on("change", function(e){
		if (typeof e.target.files[0] !== 'undefined') {
			var file = e.target.files[0]; //获取图片资源
			var reader = new FileReader();
			reader.readAsDataURL(file); // 读取文件
			// 渲染文件
			reader.onload = function(arg) {
				var img = '<img class="img-upload-preview" src="' + arg.target.result + '" alt="preview"/>';
				$("#img-upload-insert-label").before(img);
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
						Id: response.data.Id,
						Url: $scope.global.ip + response.data.Url
					});

					//若选择图片数量到达4张，不再允许添加图片
					if ($scope.furnitureRepairSubmitData.imgInfoList.length >= 4) {
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
				console.log(response);
				if (response.data.Status === 0) {
					//console.log('upload successfully');
					//获取服务器回调信息：将语音id存储到 $scope.bookingSubmitData.voiceId 中
					$scope.furnitureRepairSubmitData.voiceId = response.data.Id;

				} else {
					$scope.global.msg('语音上传出错');
				}
			}, function (response) {
				console.log('fail! ' + response);
				$scope.global.msg('连接超时');
			});
		}
	});







}]);

