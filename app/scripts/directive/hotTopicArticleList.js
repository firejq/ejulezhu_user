/**
 * Created by firejq on 2017-10-05.
 */
'use strict';

/**
 * 热门话题文章列表区块
 */
angular.module('app').directive('appHotTopicArticleList', [function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'view/template/hotTopicArticleList.html'
	};
}]);