from aiohttp import web
import socketio

from .airshark_client import listen_to_airshark_spectrum, listen_to_airshark_analyzer
from .socketio_server import SocketioNamespace

async def start_background_tasks(app):
    app['airshark_spectrum_listener'] = \
        app.loop.create_task(listen_to_airshark_spectrum(app, app['socketio_namespace']))
    app['airshark_analyzer_listener'] = \
        app.loop.create_task(listen_to_airshark_analyzer(app))

async def cleanup_background_tasks(app):
    app['airshark_spectrum_listener'].cancel()
    app['airshark_analyzer_listener'].cancel()
    await app['airshark_spectrum_listener']
    await app['airshark_analyzer_listener']

def main():
    app = web.Application()

    sio = socketio.AsyncServer(async_mode='aiohttp', logger=False)
    socketio_namespace = SocketioNamespace('/airshark')
    sio.register_namespace(socketio_namespace)
    sio.attach(app)

    app['socketio_namespace'] = socketio_namespace
    app.on_startup.append(start_background_tasks)
    app.on_cleanup.append(cleanup_background_tasks)
    web.run_app(app, port=80)

if __name__ == '__main__':
    main()
