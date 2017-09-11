'use strict';

import angular from 'angular';
import template from './navigation.html';

const navigationComponent = {
  restrict: 'E',
  template
};

const navigation = angular.module('airsharkDemo.navigation', [])
.component('navigation', navigationComponent);

export default navigation.name;
