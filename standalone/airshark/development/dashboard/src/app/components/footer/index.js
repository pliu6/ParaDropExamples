'use strict';

import angular from 'angular';
import template from './footer.html';

const footerComponent = {
  restrict: 'E',
  template
};

const footer = angular.module('airsharkDemo.footer', [])
.component('footer', footerComponent);

export default footer.name;
