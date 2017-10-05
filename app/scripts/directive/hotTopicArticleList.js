/**
 * Created by firejq on 2017-10-05.
 */
'use strict';

angular.module('app').directive('appHotTopicArticleList', [function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'view/template/hotTopicArticleList.html'
	};
}]);