'use strict';

import io from 'socket.io-client';

export default class SocketIoService {
  /* @ngInject */
  constructor() {
    this.io = io;
  }
}
