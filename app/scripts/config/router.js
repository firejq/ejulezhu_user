/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('main', {
				url: '/main',
				templateUrl: 'view/main.html',
				controller: 'mainCtrl'
			})
			.state('vrCheckRoom', {
				url: '/vrCheckRoom',
				templateUrl: 'view/vrCheckRoom.html',
				controller: 'vrCheckRoomCtrl'
			})
			.state('knowledge', {
				url: '/knowledge',
				templateUrl: 'view/knowledge.html',
				controller: 'knowledgeCtrl'
			})
			.state('hotTopic', {
				url: '/hotTopic/:id',
				templateUrl: 'view/hotTopic.html',
				controller: 'hotTopicCtrl'
			})
			.state('case', {
				url: '/case',
				templateUrl: 'view/case.html',
				controller: 'caseCtrl'
			})
			.state('me', {
				url: '/me',
				templateUrl: 'view/me.html',
				controller: 'meCtrl'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'view/login.html',
				controller: 'loginCtrl'
			})
			.state('register', {
				url: '/register',
				templateUrl: 'view/register.html',
				controller: 'registerCtrl'
			})
			.state('forgetPassword', {
				url: '/forgetPassword',
				templateUrl: 'view/forgetPassword.html',
				controller: 'forgetPasswordCtrl'
			})
			.state('about', {
				url: '/about',
				templateUrl: 'view/about.html'
			})
			.state('aboutUs', {
				url: '/aboutUs',
				templateUrl: 'view/aboutUs.html'
			})
			.state('protocol', {
				url: '/protocol',
				templateUrl: 'view/protocol.html'
			})
			.state('feedback', {
				url: '/feedback',
				templateUrl: 'view/feedback.html',
				controller: 'feedbackCtrl'
			})
			.state('personalInfo', {
				url: '/personalInfo',
				templateUrl: 'view/personalInfo.html',
				controller: 'personalInfoCtrl'
			})
			.state('changePwd', {
				url: '/changePwd',
				templateUrl: 'view/changePwd.html',
				controller: 'changePwdCtrl'
			})
			.state('addAddr', {
				url: '/addAddr/:province/:city/:area/:regionid',
				templateUrl: 'view/addAddr.html',
				controller: 'addAddrCtrl'
			})
			.state('manageAddr', {
				url: '/manageAddr',
				templateUrl: 'view/manageAddr.html',
				controller: 'manageAddrCtrl'
			})
			.state('cityPicker', {
				url: '/cityPicker/:from',
				templateUrl: 'view/cityPicker.html',
				controller: 'cityPickerCtrl'
			})
			.state('editAddress', {
				url: '/editAddress/:addrId',
				templateUrl: 'view/editAddress.html',
				controller: 'editAddressCtrl'
			});
		$urlRouterProvider.otherwise('main');
	}]);