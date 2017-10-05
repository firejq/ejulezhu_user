/**
 * Created by firejq on 2017-10-04.
 */
'use strict';

angular.module('app').run(['$rootScope', function ($rootScope) {
	var ip = 'http://120.25.74.193';

	$rootScope.global = {
		ip: 'http://120.25.74.193',
		url: ip + '/v1/',
		cryptid: '123456',
		Mobileno: '',
		Token: ''
	};


}]);