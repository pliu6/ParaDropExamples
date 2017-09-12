from aiohttp import ClientSession, BasicAuth, WSMsgType
from asyncio import CancelledError

from . import config
from .spectrum_decoder import SpectrumDecoder
from .heatmap import Heatmap

def get_authentication():
    auth = None
    headers = None
    if config.DEV_MODE:
        auth = BasicAuth(config.API_USERNAME, config.API_PASSWORD)
    else:
        headers ='Bearer:' + config.API_TOKEN

    return auth, headers

async def listen_to_airshark_spectrum(app, socketio):
    auth, headers = get_authentication()
    async with ClientSession(headers=headers, auth=auth) as session:
        try:
            ws = await session.ws_connect(config.WS_API_URL + '/airshark/spectrum', \
                autoclose=False, \
                autoping=True)

            heatmap = Heatmap(socketio)
            async for msg in ws:
                if (msg.type == WSMsgType.BINARY):
                    for (tsf, freq, noise, rssi, pwr) in SpectrumDecoder.decode(msg.data):
                        await heatmap.on_new_packet(tsf, freq, noise, rssi, pwr)
                elif msg.type == WSMsgType.ERROR:
                    print('Error during receive %s' % ws.exception())
                    break
                elif msg.type == WSMsgType.CLOSE:
                    print('Connection is closed')
                    break
                else:
                    print('Something is wrong with this connection')
                    break

        except CancelledError:
            print('connection is cancelled')

async def listen_to_airshark_analyzer(app, socketio):
    auth, headers = get_authentication()
    async with ClientSession(headers=headers, auth=auth) as session:
        try:
            ws = await session.ws_connect(config.WS_API_URL + '/airshark/analyzer', \
                autoclose=False, \
                autoping=True)

            async for msg in ws:
                if (msg.type == WSMsgType.TEXT):
                    await socketio.send_analyzer_result(msg.data)
                elif msg.type == WSMsgType.ERROR:
                    print('Error during receive %s' % ws.exception())
                    break
                elif msg.type == WSMsgType.CLOSE:
                    print('Connection is closed')
                    break
                else:
                    print('Something is wrong with this connection')
                    break

        except CancelledError:
            print('connection is cancelled')
