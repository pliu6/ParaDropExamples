'use strict';

import angular from 'angular';

import D3Service from './d3.service';
import SocketIoService from './socket-io.service';
import AirsharkService from './airshark.service';

export default angular.module('airsharkDemo.services', [
])
.service('D3', D3Service)
.service('SocketIo', SocketIoService)
.service('Airshark', AirsharkService)
.name;
