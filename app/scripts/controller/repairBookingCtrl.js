/**
 * Created by firejq on 2017-10-24.
 */
'use strict';

angular.module('app').controller('repairBookingCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');


	$scope.furnitureRepairSubmitData = {
		fixType: '',//已选择维修类型，多个用空格分隔
		fixTypeSubmit: $state.params.types,//已选择维修类型，多个用逗号分隔
		materialPrices: [],//已选择类型对应的所有维修材料，每一种材料包括描述、单价、Id、单位
		labourPrices: [],//已选择类型对应的所有人工费，每一种人工费包括描述、单价、Id
		//selectedMaterial:[],//已选择的维修材料，格式：[{id:1,selectedNum:1,price:100},{...}]
		selectedMaterialSubmit: '',//已选择的维修材料（Id和数量)，格式为：materialId:number,如 1:1,2:5
		materialPricesTotal: 0,//维修材料费合计
		//selectedLabour:[],//已选择的维修材料，格式：[{id:1,selectedNum:1,price:100},{...}]
		selectedLabourSubmit: '',//已选择的维修人工费（Id和数量），如[{labourId:1,number:2}, {labourId:2,number:1}]
		labourPricesTotal: 0,//人工费合计
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
	 * 点击维修人工费按钮的跳转函数
	 */
	$scope.labourPricesLink = function () {
		//console.log($scope.furnitureRepairSubmitData.materialPricesTotal);
		if ($scope.furnitureRepairSubmitData.materialPricesTotal === 0) {
			$scope.global.msg('请先选择维修材料费');
		} else {
			$state.go('repairBooking.labourPrice');
		}
	};


	/**
	 * 总价估价按钮函数
	 */
	$scope.evaluate = function () {
		$scope.furnitureRepairSubmitData.total = ($scope.furnitureRepairSubmitData.materialPricesTotal + $scope.furnitureRepairSubmitData.labourPricesTotal) * 1.2
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
							unit: response.data[keyName].materialprices[i].Unit,
							selected: 0//选择的数量
						});
					}

					$scope.furnitureRepairSubmitData.labourPrices.push({
						typeName: keyName,//维修类型名称
						kinds: [],//该类型拥有的所有种类
						selectedLabourId: ''//该类型选择的人工费id，为空表示未选择
					});
					//计算数组的最后一项的索引，即当前 keyName 对应的项
					var lastIndexOfLabour = $scope.furnitureRepairSubmitData.labourPrices.length - 1;
					for (var i = 0, len = response.data[keyName].labourprices.length; i < len; i++) {
						$scope.furnitureRepairSubmitData.labourPrices[lastIndexOfLabour].kinds.push({
							describe: response.data[keyName].labourprices[i].Desc,
							id: response.data[keyName].labourprices[i].Id,
							price: response.data[keyName].labourprices[i].Price,
						});
					}
				}
			}
			//console.log($scope.furnitureRepairSubmitData);

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
		for (var i = 0; i < $scope.furnitureRepairSubmitData.imgInfoList.length; i ++) {
			if ($scope.furnitureRepairSubmitData.imgInfoList[i].ImgElementId === $scope.currentPreviewImgId) {

				//删除服务器的对应图片
				$http({
					url: $scope.global.url + 'image/delete',
					method: 'GET',
					params: {
						Mobileno: mobilenoCookie,
						Token: tokenCookie,
						Usertype: 1,
						Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
						Id: $scope.furnitureRepairSubmitData.imgInfoList[i].Id//图片id
					}
				}).then(function (response) {

					if (response.data.status === 0) {
						//console.log('成功删除');
						$scope.furnitureRepairSubmitData.imgInfoList.splice(i, 1);//从数组中删除该元素
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
					$scope.furnitureRepairSubmitData.imgInfoList.push({
						ImgElementId: nameHash + '-preview-img',
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
					//console.log(response);
					if (response.data.Status === 0) {
						//console.log('upload successfully');
						//获取服务器回调信息：将语音id存储到 $scope.bookingSubmitData.voiceId 中
						$scope.furnitureRepairSubmitData.voiceId = response.data.Id;
						//console.log($scope.furnitureRepairSubmitData.voiceId);
					} else {
						$scope.global.msg('语音上传出错');
					}
				}, function (response) {
					console.log('fail! ' + response);
					$scope.global.msg('连接超时');
				});
			}
		});




	/****************************************************
	 * 维修材料费明细子页面的控制代码
	 ****************************************************/

	/**
	 * 点击维修材料的回调函数：显示模态框
	 */
	$scope.showModalOfMaterial = function (materialPrice) {
		//对象的浅复制
		$scope.currentMaterialPrice = $scope.global.shallowClone(materialPrice);
		$('#modal-'+materialPrice.$$hashKey[7]).removeClass('ng-hide');
	};
	/**
	 * 点击模态框任意地方的回调函数，隐藏模态框
	 */
	$scope.hideModalOfMaterial = function (materialPrice) {
		$('#modal-'+materialPrice.$$hashKey[7]).addClass('ng-hide');
	};
	/**
	 * 确认按钮触发函数
	 */
	$scope.materialPriceConfirm = function () {

		//console.log($scope.currentMaterialPrice);

		//将修改后的值赋值到显示信息中
		for (var i = 0, lenI = $scope.furnitureRepairSubmitData.materialPrices.length; i < lenI; i ++) {
			if ($scope.furnitureRepairSubmitData.materialPrices[i].$$hashKey === $scope.currentMaterialPrice.$$hashKey) {
				for (var kind in $scope.currentMaterialPrice.kinds) {
					//console.log('there');
					//console.log($scope.furnitureRepairSubmitData.materialPrices);
					if ($scope.currentMaterialPrice.kinds[kind].selected.toString() !== $scope.furnitureRepairSubmitData.materialPrices[i].kinds[kind].selected.toString()) {
						//console.log('kind-'+kind+' 的数量发生了改变');
						$scope.furnitureRepairSubmitData.materialPrices[i].kinds[kind].selected = $scope.currentMaterialPrice.kinds[kind].selected;

						var exitFlag = 0,//标志该kind是否已存在
							numChangedFlag = 0;//标志数量是否发生了变化
						//格式化提交预约的数据,格式为：materialId:number,如 1:1,2:5
						if ($scope.furnitureRepairSubmitData.selectedMaterialSubmit === '') {
							//console.log('首次提交');

							//若首次提交
							numChangedFlag = 1;
							$scope.furnitureRepairSubmitData.selectedMaterialSubmit = $scope.currentMaterialPrice.kinds[kind].id + ':' + $scope.currentMaterialPrice.kinds[kind].selected;
						} else {
							//若不是首次提交
							//console.log('非首次提交');
							var itemKeyAndValues = $scope.furnitureRepairSubmitData.selectedMaterialSubmit.split(',');
							for (var index in itemKeyAndValues) {
								if (itemKeyAndValues[index].split(':')[0].toString() === $scope.currentMaterialPrice.kinds[kind].id.toString()) {
									//console.log('该kind已在string中存在');
									//该kind已存在
									exitFlag = 1;
									if (itemKeyAndValues[index].split(':')[1].toString() !== $scope.currentMaterialPrice.kinds[kind].selected.toString()) {
										//若该kind的数量发生了变化，则执行数量更新，否则不执行操作
										numChangedFlag = 1;
										if ($scope.currentMaterialPrice.kinds[kind].selected !== 0) {
											//若更新后值不为0
											$scope.furnitureRepairSubmitData.selectedMaterialSubmit = $scope.furnitureRepairSubmitData.selectedMaterialSubmit.replace($scope.furnitureRepairSubmitData.selectedMaterialSubmit.split(',')[index].split(':')[0] + ':' + $scope.furnitureRepairSubmitData.selectedMaterialSubmit.split(',')[index].split(':')[1], $scope.furnitureRepairSubmitData.selectedMaterialSubmit.split(',')[index].split(':')[0]+':'+$scope.currentMaterialPrice.kinds[kind].selected);
										} else {
											//若更新后值为0 删除此字段
											if ($scope.furnitureRepairSubmitData.selectedMaterialSubmit.indexOf(',' + $scope.furnitureRepairSubmitData.selectedMaterialSubmit.split(',')[index].split(':')[0] + ':' + $scope.furnitureRepairSubmitData.selectedMaterialSubmit.split(',')[index].split(':')[1]) !== -1) {
												//若此字段前有逗号，一并删除
												$scope.furnitureRepairSubmitData.selectedMaterialSubmit = $scope.furnitureRepairSubmitData.selectedMaterialSubmit.replace(',' + $scope.furnitureRepairSubmitData.selectedMaterialSubmit.split(',')[index].split(':')[0] + ':' + $scope.furnitureRepairSubmitData.selectedMaterialSubmit.split(',')[index].split(':')[1], '');
											} else {
												//若此字段前没有逗号
												$scope.furnitureRepairSubmitData.selectedMaterialSubmit = $scope.furnitureRepairSubmitData.selectedMaterialSubmit.replace($scope.furnitureRepairSubmitData.selectedMaterialSubmit.split(',')[index].split(':')[0] + ':' + $scope.furnitureRepairSubmitData.selectedMaterialSubmit.split(',')[index].split(':')[1], '');
											}


										}


									}
									break;
								}
							}
							if (exitFlag === 0) {
								//该kind未存在，插入一条新纪录
								//console.log('此kind未在string中存在');
								numChangedFlag = 1;
								$scope.furnitureRepairSubmitData.selectedMaterialSubmit += ',' + $scope.currentMaterialPrice.kinds[kind].id + ':' + $scope.currentMaterialPrice.kinds[kind].selected;
							}

						}

					}
				}
				break;
			}
		}



		//console.log($scope.furnitureRepairSubmitData.materialPrices);
		//若材料数量发生了变化，重新计算维修材料费明细的合计，否则不重新计算
		//if (numChangedFlag === 1) {
		//console.log('再次计算');
		$scope.furnitureRepairSubmitData.materialPricesTotal = 0;
		for (var i = 0, lenI = $scope.furnitureRepairSubmitData.materialPrices.length; i < lenI; i ++) {
			for (var j = 0, lenJ = $scope.furnitureRepairSubmitData.materialPrices[i].kinds.length; j < lenJ; j ++) {
				if ($scope.furnitureRepairSubmitData.materialPrices[i].kinds[j].selected > 0) {
					$scope.furnitureRepairSubmitData.materialPricesTotal += $scope.furnitureRepairSubmitData.materialPrices[i].kinds[j].price * $scope.furnitureRepairSubmitData.materialPrices[i].kinds[j].selected;

				}
			}
		}
		//}


		//删除字符串头部多余的逗号
		if ($scope.furnitureRepairSubmitData.selectedMaterialSubmit[0] === ',') {
			$scope.furnitureRepairSubmitData.selectedMaterialSubmit = $scope.global.replacePos($scope.furnitureRepairSubmitData.selectedMaterialSubmit, 1, '');
		}
		//console.log($scope.furnitureRepairSubmitData.selectedMaterialSubmit);


		//隐藏modal层
		$('#modal-'+$scope.currentMaterialPrice.$$hashKey[7]).addClass('ng-hide');
	};
	/********************************************************/






	/********************************************************
	 * 维修人工费明细子页面的控制代码
	 *******************************************************/

	/**
	 * 点击维修材料的回调函数：显示模态框
	 */
	$scope.showModalOfLabour = function (labourPrice) {

		$scope.currentLabourPrice = labourPrice;

		$('#modal-'+labourPrice.$$hashKey[7]).removeClass('ng-hide');

	};
	/**
	 * 点击模态框任意地方的回调函数，隐藏模态框
	 */
	$scope.hideModalOfLabour = function (labourPrice) {
		$('#modal-'+labourPrice.$$hashKey[7]).addClass('ng-hide');
	};
	/**
	 * 确认按钮触发函数
	 */
	$scope.labourPriceConfirm = function (labourPriceId) {

		//将修改后的值赋值到显示信息中
		for (var i = 0, lenI = $scope.furnitureRepairSubmitData.labourPrices.length; i < lenI; i ++) {
			if ($scope.furnitureRepairSubmitData.labourPrices[i].$$hashKey === $scope.currentLabourPrice.$$hashKey) {
				$scope.furnitureRepairSubmitData.labourPrices[i].selectedLabourId = labourPriceId;
				//格式化提交预约的数据,格式为：labourId:number,如 1:1,2:5
				if ($scope.furnitureRepairSubmitData.selectedLabourSubmit === '') {
					$scope.furnitureRepairSubmitData.selectedLabourSubmit = labourPriceId + ':1';
				} else {
					$scope.furnitureRepairSubmitData.selectedLabourSubmit += ',' + labourPriceId + ':1';
				}
				break;
			}
		}

		//计算维修材料费明细的合计
		$scope.furnitureRepairSubmitData.labourPricesTotal = 0;
		for (var i = 0, lenI = $scope.furnitureRepairSubmitData.labourPrices.length; i < lenI; i ++) {
			var curLabourPriceId = $scope.furnitureRepairSubmitData.labourPrices[i].selectedLabourId;
			for (var j = 0, lenJ = $scope.furnitureRepairSubmitData.labourPrices[i].kinds.length; j < lenJ; j ++) {
				if ($scope.furnitureRepairSubmitData.labourPrices[i].kinds[j].id === curLabourPriceId) {
					$scope.furnitureRepairSubmitData.labourPricesTotal += $scope.furnitureRepairSubmitData.labourPrices[i].kinds[j].price;
					break;
				}
			}
		}

		//隐藏modal层
		$('#modal-'+$scope.currentLabourPrice.$$hashKey[7]).addClass('ng-hide');
	};

	/******************************************************/








	/**
	 * 提交订单
	 */
	$scope.repairBookingOrderSubmit = function () {
		if ($scope.furnitureRepairSubmitData.appointTime === '') {
			$scope.global.msg('请选择上门时间');
			return;
		}
		if ($scope.furnitureRepairSubmitData.attact === '') {
			$scope.global.msg('请留言');
			return;
		}

		//格式化图片id字符串
		var imageIds = '';
		for (var i = 0, len = $scope.furnitureRepairSubmitData.imgInfoList.length; i < len; i ++) {
			if (i === 0) {
				imageIds += $scope.furnitureRepairSubmitData.imgInfoList[i].Id;
				continue;
			}
			imageIds += ',' + $scope.furnitureRepairSubmitData.imgInfoList[i].Id;
		}


		$http({
			url: $scope.global.url + 'order/place',
			method: 'GET',
			params: {
				Mobileno: mobilenoCookie,
				Token: tokenCookie,
				Usertype: 1,
				Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
				ImageId: imageIds,//图片文件id
				VoiceId: $scope.furnitureRepairSubmitData.voiceId,//语音文件id
				TotalPrice: $scope.furnitureRepairSubmitData.total,
				AddrId: $scope.furnitureRepairSubmitData.addrId,//维修地址Id
				AppintmentTime: (new Date($scope.furnitureRepairSubmitData.appointTime).getTime())/1000,//unix时间戳
				Attact: $scope.furnitureRepairSubmitData.attact,//留言
				FixType: $scope.furnitureRepairSubmitData.fixTypeSubmit,//维修类型
				LabourId: $scope.furnitureRepairSubmitData.selectedLabourSubmit,//人工Id
				MaterialId: $scope.furnitureRepairSubmitData.selectedMaterialSubmit//材料Id

			}
		}).then(function (response) {

			console.log(response);
			if (response.data.Status === 0) {
				$scope.global.msg('提交成功');
				$state.go('myOrderDetail', {orderId: response.data.Orderid, orderNo: response.data.Orderno});


			} else {
				$scope.global.msg('提交出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
			$scope.global.msg('连接超时');
		});
	};



}]);

