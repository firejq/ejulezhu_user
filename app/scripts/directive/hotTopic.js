/**
 * Created by firejq on 2017-10-04.
 */
'use strict';

/**
 * 首页热门话题区块
 */
angular.module('app').directive('appHotTopic', function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'view/template/hotTopic.html',
		scope: {
			topics: '='
		}
	};
});