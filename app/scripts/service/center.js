/**
 * Created by firejq on 2017-10-11.
 */
'use strict';
// 控制模态框垂直居中
angular.module('app').factory('center',function(){
	return function (ele, wid) {
		$(ele).on('show.bs.modal', function () {
			var $this = $(this);
			var $modal_dialog = $this.find('.modal-dialog');
			// 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
			// $this.css('display', 'block');
			$this.css({'width': wid, 'display': 'block', 'margin': '0 auto'});
			if ($modal_dialog.height() > $(window).height()) {
				$modal_dialog.css('margin-top', '2rem');
			} else {
				$modal_dialog.css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2)});
			}

		});
	};
});