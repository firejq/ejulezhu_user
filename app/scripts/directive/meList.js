/**
 * Created by firejq on 2017-10-06.
 */
'use strict';

angular.module('app').directive('appMeList', [function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'view/template/meList.html',
		link: function ($scope) {
			$scope.goPage = function (index) {
				if ($scope.user.loginChecked === true) {
					//已登陆，正常跳转逻辑
					var minePages = ['order.html', 'user_info.html'];
					top.location = minePages[index];
				} else {
					//未登录，跳转到登陆页面
					//window.location.parent.href = 'login.html';
					top.location = 'login.html';
				}
			};

			$scope.customerService = function () {
				window.location = 'tel:4009268200';
			};

			$scope.about = function () {
				window.location = 'about.html';
			};

			$scope.feedback = function () {
				top.location = 'feedback.html';
			};
		}
	};
}]);