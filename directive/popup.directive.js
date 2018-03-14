!(function(){'use strict';
	angular.module('myComponent')

  .factory('popup',['$uibModal', function($uibModal) {

    function SelfAlert(data, parent){
		return $uibModal.open({
			backdrop: 'static',
			animation: true,
			appendTo: parent,
			component: 'alert',
			resolve: {
				items: function () {
					return data;
				}
			}
		})
    }
	
    function SelfConfirm(data, parent){
		return $uibModal.open({
			backdrop: 'static',
			animation: true,
			appendTo: parent,
			component: 'confirm',
			resolve: {
				items: function () {
					return data;
				}
			}
		});
    }
	
    function officerList(data, parent){
		return $uibModal.open({
			backdrop: 'static',
			animation: true,
			// appendTo: parent,
			component: 'officerList',
			resolve: {
				items: function () {
					return data;
				}
			}
		});
    }
    return {
      SelfAlert : SelfAlert,
	  SelfConfirm : SelfConfirm,
	  officerList : officerList
    }
  }])



})()
