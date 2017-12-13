/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').controller('meCtrl', ['$scope', '$http', 'cache', function ($scope, $http, cache) {

	// 检测是否已登陆:loginChecked为true表示已登陆，false表示未登录
	$scope.user = {};
	$scope.user.loginChecked = !(typeof cache.get('Mobileno') === 'undefined' || typeof cache.get('Token') === 'undefined');


	if ($scope.user.loginChecked === true) {
		//若已登陆，获取用户信息
		$scope.user.phone = cache.get('Mobileno');
		var token =  cache.get('Token');
		var unix_time = Math.round(new Date().getTime()/1000);//10位unix时间戳

		//获取用户信息
		$http({
			method: 'GET',
			url: $scope.global.url + 'user/info',
			params: {
				Mobileno: $scope.user.phone,
				Token: token,
				Reqtime: unix_time,
				Usertype: 1
			}
		}).then(function (response) {

			if (response.data.status === 0) {
				//console.log(response.data);
				$scope.user.Username = response.data.Username;
				$scope.user.Points = response.data.Points;
				$scope.user.Image = $scope.global.ip + response.data.Image;
			}

		}, function (response) {
			console.log('fail!' + response);
		});
	}



	/**
	 * 修改头像
	 */
	$scope.changeHeadImage = function () {
		//弹出底部对话框
		layer.open({
			content: '请选择上传方式',
			btn: ['<label style="color: #000;font-weight: normal;" for="head-image">从相册选取</label>', '<span style="color: #000;background-color: #dadada">取消</span>'],
			skin: 'footer',
			yes: function(index) {
				/**
				 * 上传头像监听事件
				 */
				document.getElementById('head-image').addEventListener("change", function(e) {
					//console.log('trigger');
					//alert('已选择图片');
					if (typeof e.target.files[0] !== 'undefined') {
						var file = e.target.files[0]; //获取图片资源
						//console.log(file);
						//上传图片
						var img_form = new FormData();
						img_form.append('File', file);
						img_form.append('Mobileno', cache.get('Mobileno'));
						img_form.append('Token', cache.get('Token'));
						img_form.append('Usertype', 1);
						img_form.append('Reqtime', Math.round(new Date().getTime()/1000));

						$http({
							url: $scope.global.url + 'user/uploadimage',
							method: 'POST',
							data: img_form,
							headers: {
								'Content-Type': undefined
							},
							transformRequest: angular.identity
						}).then(function (response) {

							//console.log(response);
							if (response.data.status === 0) {
								$scope.user.Image = $scope.global.ip + response.data.url;
								$scope.global.msg('头像上传成功~');
								//location.reload();

							} else {
								$scope.global.msg('头像上传出错');
							}

							//关闭弹窗
							layer.close(index);

						}, function (response) {
							console.log('fail! ' + response);
							$scope.global.msg('连接超时');
						});
					}
				});


				//关闭弹窗
				layer.close(index);
			}
		});
	};








}]);

