/**
 * Created by firejq on 2017-10-10.
 */
'use strict';

angular.module('app').controller('feedbackCtrl', ['$scope', '$http', 'cache', '$state',  function ($scope, $http, cache, $state) {

	// 初始化数据
	$scope.feedbackData = {
		type: [],//用于存放所有可选类型
		selectType: 1,//用户反馈类型，预设为第1项
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
		} else {

		}
	}, function (response) {
		console.log('fail! ' + response);
	});


	// TODO 点击按钮就上传图片，久之导致服务器积累大量无用的图片，待改善，如点击提交反馈才一次性上传全部图片
	// TODO 图片选中后如何删除？取消选中？


	//监听上传按钮，选中文件即触发
	$("#feedback-pic").on("change", function(e){
		if (typeof e.target.files[0] !== 'undefined') {
			var file = e.target.files[0]; //获取图片资源
			var reader = new FileReader();
			reader.readAsDataURL(file); // 读取文件
			// 渲染文件
			reader.onload = function(arg) {
				var img = '<img class="feedback-pic-preview" src="' + arg.target.result + '" alt="preview"/>';
				$("#feedback-pic-insert-label").before(img);
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
						Url: $scope.global.ip + response.data.Url
					});

					//若选择图片数量到达4张，不再允许添加图片
					if (imgInfoList.length >= 10) {
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
		feedback_form.append('Feedbacktype', $scope.feedbackData.selectType);
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

