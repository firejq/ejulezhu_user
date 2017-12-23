/**
 * Created by firejq on 2017-10-10.
 */
'use strict';

angular.module('app').controller('feedbackCtrl', ['$scope', '$http', 'cache', '$state',  function ($scope, $http, cache, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	$scope.feedbackData = {
		type: [],//用于存放所有可选类型
		selected: {
			TypeId: 1,//已选用户反馈类型Id
			TypeName: ''//已选用户反馈类型名，获取反馈类型后赋值
		},
		advise: ''//用户反馈信息内容
	};
	var imgInfoList = [];//已上传到服务器的所有图片的信息列表

	/**
	 * 获得反馈类型
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'feedback/getfeedbacktype'
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			$scope.feedbackData.type = response.data.records;
			//将已选类型预设为第一种类型
			$scope.feedbackData.selected.TypeName = response.data.records[0].Type;
			$scope.feedbackData.selected.TypeId = response.data.records[0].Id;

			//console.log($scope.feedbackData.type);
		} else {

		}
	}, function (response) {
		console.log('fail! ' + response);
	});


	/**
	 * 反馈类型选择的回调函数，参数名必须与传入对象的字段名相对应，否则会出错
	 * @param Id
	 * @param Type
	 */
	$scope.clickToSelectType = function (Id, Type) {
		console.log(Id  + ' ' + Type);
		$scope.feedbackData.selected.TypeName = Type;
		$scope.feedbackData.selected.TypeId = Id;
	};




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
		document.getElementById($scope.currentPreviewImgId).classList.add('feedback-pic-preview-clicked');

	};
	/**
	 * 隐藏遮罩层同时缩小图片
	 */
	$scope.hideModal = function () {
		document.getElementById('preview-img-modal').style.display = 'none';
		document.getElementById($scope.currentPreviewImgId).classList.remove('feedback-pic-preview-clicked');

	};

	/**
	 * 取消上传图片
	 */
	$scope.cancelUploadImg = function () {
		$scope.hideModal();
		document.getElementById($scope.currentPreviewImgId).style.display = 'none';
		for (var i = 0; i < imgInfoList.length; i ++) {
			if (imgInfoList[i].ImgElementId === $scope.currentPreviewImgId) {

				//删除服务器的对应图片
				$http({
					url: $scope.global.url + 'image/delete',
					method: 'GET',
					params: {
						Mobileno: mobilenoCookie,
						Token: tokenCookie,
						Usertype: 1,
						Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
						Id: imgInfoList[i].Id//图片id
					}
				}).then(function (response) {

					if (response.data.status === 0) {
						//console.log('成功删除');
						imgInfoList.splice(i, 1);//从数组中删除该元素
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


	//监听上传按钮，选中文件即触发
	$("#feedback-pic").on("change", function(e){
		if (typeof e.target.files[0] !== 'undefined') {
			var file = e.target.files[0]; //获取图片资源
			var nameHash = $scope.global.hashCode(file.name);//根据文件名计算hash值
			var reader = new FileReader();
			reader.readAsDataURL(file); // 读取文件
			// 渲染文件
			reader.onload = function(arg) {
				var img = '<img id="' + nameHash + '-preview-img" class="feedback-pic-preview" src="' + arg.target.result + '" alt="preview"/>';
				//插入到dom中
				$("#feedback-pic-insert-label").before(img);
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
					imgInfoList.push({
						ImgElementId: nameHash + '-preview-img',
						Id: response.data.Id,
						Url: $scope.global.imagesServer + response.data.Url
					});

					//若选择图片数量到达4张，不再允许添加图片
					if (imgInfoList.length >= 4) {
						document.getElementById('feedback-pic-insert-label').style.display='none';
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
	 * 提交反馈
	 */
	$scope.feedbackSubmit = function () {

		if ($scope.feedbackData.advise === '') {
			$scope.global.msg('意见反馈不能为空~');
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

		var feedback_form = new FormData();
		feedback_form.append('Mobileno', cache.get('Mobileno'));
		feedback_form.append('Feedback', $scope.feedbackData.advise);
		feedback_form.append('Feedbacktype', $scope.feedbackData.selected.TypeId);
		feedback_form.append('Imageid', imageIds);
		$http({
			url: $scope.global.url + 'feedback',
			method: 'POST',
			data: feedback_form,
			headers: {
				'Content-Type': undefined
			}
		}).then(function (response) {
			if (response.data.status === 0) {
				$scope.global.msg('提交反馈成功');
				$state.go('me');
			} else {
				$scope.global.msg('提交反馈出错');
				location.reload();
			}
		}, function (response) {
			console.log('fail! ' + response);
			$scope.global.msg('连接超时');
		});
	};


}]);

