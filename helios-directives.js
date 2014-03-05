(function(window, angular, undefined) {'use strict';
    angular.module('heliosDirectives', ['ng'])
        .directive('centerVideo', ['$rootScope', function($rootScope) {
            return {
                link: function($scope, $elem, attrs) {

                    var ratio = $scope.$eval(attrs.centerVideo) || [16,9];

                    $elem[0].style.position = 'absolute';
                    $elem[0].style.top = 50 + '%';
                    $elem[0].style.left = 50 + '%';

                    var setMargins = function(w, h) {
                        $elem[0].style.marginLeft = -w/2 + 'px';
                        $elem[0].style.marginTop = -h/2 + 'px';
                    }

                    $rootScope.$watchCollection('[windowWidth, windowHeight]', function(newVal){
                        var styleOrder = (newVal[0]/newVal[1]) < (ratio[0]/ratio[1]) ? ['height', 'width'] : ['width', 'height'];

                        $elem[0].style[styleOrder[0]] = 100 + '%';
                        $elem[0].style[styleOrder[1]] = 'auto';

                        setMargins($elem[0].offsetWidth, $elem[0].offsetHeight);
                    });
                }
            }
        }]);
        
})(window, window.angular);

