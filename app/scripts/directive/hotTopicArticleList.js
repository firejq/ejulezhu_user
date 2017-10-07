/**
 * Created by firejq on 2017-10-05.
 */
'use strict';

angular.module('app').directive('appHotTopicArticleList', [function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'view/template/hotTopicArticleList.html'
		//link: function (scope) {
		// TODO 1. onscroll 无法绑定在 div 上，只能绑定在 window 上
		// TODO 2. scrollHeight、scrollTop、clientHeight 值与预料不同
		//	window.onscroll = function (e) {
		//		//监听事件内容
		//		var div = document.getElementById("scrollDiv");
		//		console.log(div.offsetHeight);
		//		console.log(div.scrollTop);
		//		console.log(div.scrollHeight);
		//		if (div.scrollHeight - div.scrollTop === div.clientHeight) {
		//			scope.GetItem(scope.id, scope.pageNum++);
		//		}
		//	};
		//}
	};
}]);