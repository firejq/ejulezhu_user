/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').directive('appHead', ['transUrl', function (transUrl) {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'view/template/head.html',
		scope: {
			hasBack: '@',
			text: '@',
			hasComplete: '@',
			hasRepairValuation: '@',
			hasMessageBox: '@',
			//hasMessageUnread: '@',
			hasShare: '@',
			hasPaymentRecord: '@'
		},
		link: function(scope, elem, attrs) {
			/**
			 * 后退
			 */
			scope.back = function() {
				window.history.back();
			};

			/**
			 * 在“支付进度款”页面，为“支付记录”路由传递参数
			 */
			if (typeof scope.$parent.orderDetail !== 'undefined') {
				scope.paymentRecordOrderNo = function () {
					return scope.$parent.orderDetail.Orderno;
				};
			}

			/**
			 * “抢红包”页面的分享按钮回调函数
			 */
			scope.share = function () {
				scope.$parent.showShare();
			};


		}
	};
}]);