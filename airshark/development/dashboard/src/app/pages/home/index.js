'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';

import template from './home.html';

const homeComponentName = 'homePage';

const homeComponent = {
  template,
  restrict: 'E'
};

const home = angular.module('airsharkDemo.home', [
  uiRouter
])
.component(homeComponentName, homeComponent)
.config($stateProvider => {
  'ngInject';

  $stateProvider
  .state('home', {
    url: '/',
    component: homeComponentName
  });
});

export default home.name;
