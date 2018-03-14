/*
    router data define
    author: lianglifeng
    E-mail: lianglf@alhigh.com.cn
    time: 2017.4.5
 */
!(function() {
    'use strict';

    angular.module('companyApply', []);
    angular.module('companyApply')
        .config(['$stateProvider', function($stateProvider) {

            $stateProvider
                // 在这里添加url路由
                .state('company-apply', {
                    title: '公司信息申请',
                    url: '/company-apply',
                    templateUrl: 'page/company-apply/company-apply.template.html',
                    controller: ['$scope', 'SIGN', '$timeout', 'popup', 'ConfigData', firmDetailed]
                });
        }]);


    function firmDetailed($scope, SIGN, $timeout, popup, ConfigData) {
        initStatus();
        initData();
        //初始状态 
        function initStatus() {
            $scope.status = {
                companyName: "", //企业名称
                legalPerson: "", //法人代表
                logo: "", //企业logo
                businessLicense: "", //营业执照
                businessLicenseHold: "", //手持营业执照
                organizationCode: "", //组织机构代码
                setupDate: "", //成立时间
                contactsTel: "", //企业电话
                contactsEmail: "", //公司邮箱
                businessScope: "", //公司网址
                business: "", //经营范围
                addr: {
                    province: '',
                    city: '',
                    area: '',
                    detailAddress: ''
                }, //企业地址
                companyId: "",
                companyInfo: "", //企业简介
            };
            $scope.data = {
                statusTitle: "完善公司信息",
                statusClass1: false,
                statusClass2: false,
                editForm: false,
                status: "",
                saveData: 'company/updatePfCompany'
            };
            //验证公司名称是否已存在
            $scope.showTip = false;
        }
        // 初始请求
        function initData() {
            httpServer();

        }

        $scope.checkCompanyName = function() {
            if ($scope.status.companyName == "") {
                return;
            }
            var checkUrl = 'company/checkCompanyName/' + $scope.status.companyName;
            SIGN.get(checkUrl, "")
                .then(function(data) {
                    if (data == "0") {
                        $scope.showTip = false;
                    } else {
                        $scope.showTip = true;
                    }
                }).catch(function(data) {});
        };
        $scope.hideTip = function() {
            $scope.showTip = false;
        };




        // 请求数据
        function httpServer() {
            SIGN.get('company/viewPfCompany', "")
                .then(function(data) {
                    if (data.status == "0") {
                        // 审核不通过
                        $scope.data.statusClass2 = true;
                        $scope.data.statusTitle = "审核未通过，请修改信息再次提交";
                        $scope.status = data.data[0];
                        $scope.status.setupDate = new Date($scope.status.setupDate);
                        $scope.status.addr = {
                            province: data.data[0].province,
                            city: data.data[0].city,
                            area: data.data[0].area,
                            detailAddress: data.data[0].address
                        };
                        $scope.status = data.data[0];
                        $scope.status.addr = {};
                        $scope.status.addr.province = data.data[0].province;
                        $scope.status.addr.city = data.data[0].city;
                        $scope.status.addr.area = data.data[0].area;
                        $scope.status.addr.detailAddress = data.data[0].address;
                    } else if (data.status == "1") {
                        // 审核通过
                    } else if (data.status == "2") {
                        // 审核中
                        $scope.data.statusClass1 = true;
                        $scope.data.editForm = true;
                        $scope.data.statusTitle = "信息审核中，请耐心等待";
                        $scope.status = data.data[0];
                        $scope.status.setupDate = new Date($scope.status.setupDate);
                        $scope.status.addr = {
                            province: data.data[0].province,
                            city: data.data[0].city,
                            area: data.data[0].area,
                            detailAddress: data.data[0].address
                        };
                    } else if (data.status == "3") {
                        // 没有提交公司审请
                    }
                }).catch(function(data) {
                    console.log(data);
                });
        }
        //上传图片
        $('#fileImg1').change(function(event) {
            upLoadImg(event);
        });
        $('#fileImg2').change(function(event) {
            upLoadImg(event);
        });
        $('#fileImg3').change(function(event) {
            upLoadImg(event);
        });

        var data = new FormData();
        /**
         * [uploadImg 上传图片]
         * @param  {[type]} item  [传入当前捕捉到的值]
         * @return {[type]}    [description]
         */
        function upLoadImg(item) {
            var files = item.currentTarget.files[0];
            if (files) {
                data.delete('uploadFiles');
                data.append('uploadFiles', files);
            } else {
                return;
            }
            SIGN.uploadFile('file/singleFileUpload', data)
                .then(function(data) {
                    if (item.currentTarget.id == 'fileImg1') {
                        $scope.status.logo = data.data;
                    } else if (item.currentTarget.id == 'fileImg2') {
                        $scope.status.businessLicense = data.data;
                    } else if (item.currentTarget.id == 'fileImg3') {
                        $scope.status.businessLicenseHold = data.data;
                    }
                }).catch(function(data) {
                    console.log(data.msg);
                });
        }
        //保存
        $scope.save = function() {
            if ($scope.showTip == true) {
                layer.msg("企业名称已存在，请重新输入");
                return;
            }
            var params = {
                companyId: $scope.status.companyId,
                companyName: $scope.status.companyName,
                legalPerson: $scope.status.legalPerson,
                logo: $scope.status.logo,
                businessLicense: $scope.status.businessLicense,
                businessLicenseHold: $scope.status.businessLicenseHold,
                organizationCode: $scope.status.organizationCode,
                setupDate: moment($scope.status.setupDate).format('YYYY-MM-DD'),
                contactsTel: $scope.status.contactsTel,
                contactsEmail: $scope.status.contactsEmail,
                companyWebsite: $scope.status.companyWebsite,
                businessScope: $scope.status.businessScope,
                province: $scope.status.addr.province,
                city: $scope.status.addr.city,
                area: $scope.status.addr.area,
                address: $scope.status.addr.detailAddress,
                companyInfo: $scope.status.companyInfo,
                identifyFlag: "0", // 默认传0,未经过认证
                companyType: "0" //公司类别，默认传0
            };
            SIGN.post("company/updatePfCompany", params)
                .then(function(data) {
                    layer.msg("信息提交成功");
                    $scope.data.editForm = true;

                }).catch(function(data) {
                    console.log(data.msg);
                });




        };





    }
})();