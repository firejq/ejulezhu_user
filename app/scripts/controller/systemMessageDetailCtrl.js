/**
 * Created by firejq on 2017-12-23.
 */

'use strict';

angular.module('app').controller('systemMessageDetailCtrl', ['$scope', '$state', '$sce', 'cache', function ($scope, $state, $sce, cache) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	// 为 iframe 的src赋值
	$scope.url = $sce.trustAsResourceUrl('http://www.ejx88.com:9090/html/message?Id=' + $state.params.id + '&PlateType=ejx&Mobileno=' + mobilenoCookie + '&Usertype=1&Token=' + tokenCookie + '&Reqtime=' + Math.round(new Date().getTime()/1000));


}]);


