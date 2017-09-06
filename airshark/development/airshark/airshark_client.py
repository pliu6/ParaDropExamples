from aiohttp import ClientSession, BasicAuth, WSMsgType
from asyncio import CancelledError

from .spectrum_decoder import SpectrumDecoder
from .heatmap import Heatmap

async def listen_to_airshark_spectrum(app, heatmap_socketio):
    async with ClientSession(auth=BasicAuth('paradrop', '')) as session:
        try:
            ws = await session.ws_connect('ws://home.paradrop.org/ws/airshark/spectrum', \
                autoclose=False, \
                autoping=True)

            heatmap = Heatmap(heatmap_socketio)

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
        except CancelledError:
            print('connection is cancelled')

async def listen_to_airshark_analyzer(app):
    pass
