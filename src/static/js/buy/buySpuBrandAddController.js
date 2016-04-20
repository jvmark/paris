angular.module('buySPUBrandAddController', [])
	.controller('buySpuBrandAddCtrl', ['$scope', 'BuyService', '$location', 'ngDialog', '$routeParams', function($scope, BuyService, $location, ngDialog, $routeParams) {
		var limit = 50;
		$scope.editSpuBrand = {
			'id': 0,
			'name': '',
			'pic': '',
			'desc': ''
		};
		$scope.updatetmp = {};
		$scope.queryContent = '';
		$scope.queryResults = [];
		// 查询方式
		$scope.queryMaps = [{
			value: 'spubrand_name',
			text: '品牌名称'
		}, {
			value: 'spubrand_id',
			text: '品牌ID'
		}];
		$scope.queryWay = $scope.queryMaps[0].value;

		function init() {
			BuyService.spubrand.getBrandList().then(function(jsn){
		          $scope.brandList = jsn.data.object_list;
		      });
		}
		init();
		$scope.upload = function(item, fileId_) {
			var file = $('#' + fileId_)[0].files[0];
			if (file == null) {
				alert("请上传图片");
				return;
			}
			var formData = new FormData();
			formData.append("img", file);
			formData.append("data", 'img');
			formData.append("type", 'blog');
			var xhr = new XMLHttpRequest();
			//设置回调函数
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					var _json = JSON.parse(xhr.responseText);
					if (_json.status == 1) {
						item.pic = _json.data.img_url;
						$scope.$apply();
						alert("上传成功 :  " + _json.data.img_url);
					} else {
						alert(JSON.parse(xhr.responseText).message);
					}
				}
			}
			xhr.open("POST", getDomain() + "/napi/upload/photo/", true);
			xhr.withCredentials = true;
			// 发送表单数据
			xhr.send(formData);
		}

		function getDomain() {
			return "";
			// if ($location.host() === 'operate.duitang.com') {
			// 	return "http://www.duitang.com";
			// } else if ($location.host() === 'operatep.s.duitang.com') {
			// 	return "http://p.s.duitang.com";
			// } else {
			// 	return "http://t007.v2.s.duitang.com";
			// }
		};
		$scope.query = function(_start) {
			if ($scope.queryWay === 'spubrand_id') {
				$scope.loadById($scope.queryContent);
			} else if ($scope.queryWay === 'spubrand_name') {
				$scope.prefixQuery(_start, $scope.queryContent);
			} else {
				return;
			}
		}
		$scope.prefixQuery = function(_start, name) {
				BuyService.spubrand.prefixQuery({
					"name": name,
					"start": _start,
					"limit": limit
				}).then(function(jsn) {
					$scope.queryResults = jsn.data.object_list;
					var nextStart = jsn.data.next_start;
					var hasnext = jsn.data.more;
					var baseUrl = '#/SPUBRAND/add/';
					var searcharg = {
						name: name,
						start: nextStart,
						limit: limit,
					};
					//翻页
					Pnpaginator._init($scope, nextStart, limit, hasnext, baseUrl, searcharg);
					$('.pagecnt').css({
						"display": "inline-block"
					});
				});
			}
			// 监听地址栏地址变化
		$scope.$on('$routeUpdate', function(event, route) {
			var page = route.params.page || 0;
			start = (parseInt(page) - 1) * limit || 0;
			$scope.query(start);
		});
		$scope.loadById = function(id) {
			BuyService.spubrand.loadById({
				"id": id
			}).then(function(jsn) {
				$scope.queryResults = [jsn.data];
			});
		}
		$scope.openSpuBrandEditDialog = function(eitem) {
			$scope.editBrand = angular.copy(eitem);
			$scope.updatetmp = eitem;
			//打开对话框
			ngDialog.open({
				template: 'editSpuBrand',
				scope: $scope,
				disableAnimation: true,
			});
		}
		$scope.editSpuBrand = function(eitem) {
			BuyService.spubrand.updateSpuBrand({
				"id": eitem.id,
				"pic_url": eitem.pic,
				"desc": eitem.desc
			}).then(function(jsn) {
				$scope.updatetmp.desc = eitem.desc;
				$scope.updatetmp.pic = eitem.pic;
				// $scope.$apply();
				SUGAR.PopOut.alert('<div class="prompt"><h3>更新成功</h3></div>');
				$({}).delay(4000).queue(function() {
					SUGAR.PopOut.closeMask();
				});
			})
		}
	}]);