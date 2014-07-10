(function(window, angular, undefined) {'use strict';
    angular.module('heliosDirectives', ['ng'])
        .directive('centerRatio', ['$rootScope', function($rootScope) {
            return {
                link: function($scope, $elem, attrs) {

                    var ratio = $scope.$eval(attrs.centerRatio) || [16,9];

                    $elem[0].style.position = 'absolute';
                    $elem[0].style.top = 50 + '%';
                    $elem[0].style.left = 50 + '%';

                    var setMargins = function(w, h) {
                        $elem[0].style.width = w +'px';
                        $elem[0].style.height = h + 'px';
                        $elem[0].style.marginLeft = -w/2 + 'px';
                        $elem[0].style.marginTop = -h/2 + 'px';
                    }

                    var setOrders = function(dim, ratios) {
                        var styleOrder = (dim[0]/dim[1]) < (ratios[0]/ratios[1]) ? ['height', 'width'] : ['width', 'height'];
                        if (styleOrder[0] == 'width') {
                            var w = dim[0];
                            var h = ratios[1]/ratios[0]*dim[0];
                        } else {
                            var h = dim[1];
                            var w = ratios[0]/ratios[1]*dim[1];
                        }

                        setMargins(w, h);
                    }

                    attrs.$observe('centerRatio', function(newVal) {
                        // if (!newVal) { return; }
                        var ratio = $scope.$eval(newVal) || [16,9];
                        var dimensions = [$rootScope.windowWidth, $rootScope.windowHeight];

                        setOrders(dimensions, ratio);
                    });

                    $rootScope.$watchCollection('[windowWidth, windowHeight]', function(newVal, oldVal){
                        if (newVal[0] === oldVal[0] && newVal[1] === oldVal[1]) { return; }
                        var ratio = $scope.$eval(attrs.centerRatio) || [16,9];
                        setOrders(newVal, ratio);
                    });
                }
            }
        }]);
        
})(window, window.angular);

