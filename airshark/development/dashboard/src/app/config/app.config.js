'use strict';

function AppConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  'ngInject';

  $locationProvider.html5Mode(false);
  $urlRouterProvider.otherwise('/');
}

export default AppConfig;
