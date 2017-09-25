'use strict';

import angular from 'angular';

import './analyzer.scss';
import template from './analyzer.html';

class analyzerController {
  /* @ngInject */
  constructor($log, $scope, Airshark) {
    this._$log = $log;
    this._$scope = $scope;
    this.socket = Airshark.socket;
  }

  $onInit() {
    this.airsharkEvents = [];
    this.socket.on('analyzer', this.onAirsharkMessage.bind(this));
  }

  $onDestroy() {
    this.socket.off('analyzer', this.onAirsharkMessage.bind(this));
  }

  onAirsharkMessage(msg) {
    this._$log.log(msg);
    this.airsharkEvents.push(angular.fromJson(msg));
    if (this.airsharkEvents.length === 11) {
      this.airsharkEvents.shift();
    }
    this._$scope.$apply();
  }
}

const analyzerComponent = {
  restrict: 'E',
  template,
  controller: analyzerController
};

const analyzer = angular.module('paradropPortal.analyzer', [
])
.component('analyzer', analyzerComponent);

export default analyzer.name;
