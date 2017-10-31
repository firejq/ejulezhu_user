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
			.state('hotTopicArticleDetail', {
				url: '/hotTopicArticleDetail/:id',
				templateUrl: 'view/hotTopicArticleDetail.html',
				controller: 'hotTopicArticleDetailCtrl'
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
			.state('myOrder', {
				url: '/myOrder',
				templateUrl: 'view/myOrder.html',
				controller: 'myOrderCtrl'
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
				url: '/editAddress/:addrId/:province/:city/:area/:regionid',
				templateUrl: 'view/editAddress.html',
				controller: 'editAddressCtrl'
			})
			.state('redPackage', {
				url: '/redPackage',
				templateUrl: 'view/redPackage.html',
				controller: 'redPackageCtrl'
			})
			.state('furnitureRepair', {
				url: '/furnitureRepair',
				templateUrl: 'view/furnitureRepair.html',
				controller: 'furnitureRepairCtrl'
			})
			.state('overallDecoration', {
				url: '/overallDecoration',
				templateUrl: 'view/overallDecoration.html',
				controller: 'overallDecorationCtrl'
			})
			.state('myOrderDetail', {
				url: '/myOrderDetail/:orderId/:orderNo',
				templateUrl: 'view/myOrderDetail.html',
				controller: 'myOrderDetailCtrl'
			})
			.state('myOrderDetail.state', {
				url: '/state',
				templateUrl: 'view/myOrderDetail.state.html'
			})
			.state('myOrderDetail.detail', {
				url: '/detail',
				templateUrl: 'view/myOrderDetail.detail.html'
			})
			.state('orderPayRecords', {
				url: '/orderPayRecords/:orderNo',
				controller: 'orderPayRecordsCtrl',
				templateUrl: 'view/orderPayRecords.html'
			})
			.state('confirmMasterPrice', {
				url: '/confirmMasterPrice/:orderId/:orderNo',
				controller: 'confirmMasterPriceCtrl',
				templateUrl: 'view/confirmMasterPrice.html'
			})
			.state('continueQueryPrice', {
				url: '/continueQueryPrice/:orderId/:orderNo',
				controller: 'continueQueryPriceCtrl',
				templateUrl: 'view/continueQueryPrice.html'
			})
			.state('payProgressPayment', {
				url: '/payProgressPayment/:orderId/:orderNo',
				controller: 'payProgressPaymentCtrl',
				templateUrl: 'view/payProgressPayment.html'
			})
			.state('finishProjectPay', {
				url: '/finishProjectPay/:orderId/:orderNo',
				controller: 'finishProjectPayCtrl',
				templateUrl: 'view/finishProjectPay.html'
			})
			.state('decorationBooking', {
				url: '/decorationBooking/:styleId',
				controller: 'decorationBookingCtrl',
				templateUrl: 'view/decorationBooking.html'
			})
			.state('overallDecorationSubmit', {
				url: '/overallDecorationSubmit/:styleId/:stylePriceId',
				controller: 'overallDecorationSubmitCtrl',
				templateUrl: 'view/overallDecorationSubmit.html'
			})
			.state('repairBooking', {
				url: '/repairBooking/:types',
				controller: 'repairBookingCtrl',
				templateUrl: 'view/repairBooking.html'
			})
			.state('repairBooking.materialPrice', {
				url: '/materialPrice',
				templateUrl: 'view/repairBooking.materialPrice.html'
			})
			.state('repairBooking.labourPrice', {
				url: '/labourPrice',
				templateUrl: 'view/repairBooking.labourPrice.html'
			})
			.state('repairValuation', {
				url: '/repairValuation',
				controller: 'repairValuationCtrl',
				templateUrl: 'view/repairValuation.html'
			});
		$urlRouterProvider.otherwise('main');
	}]);