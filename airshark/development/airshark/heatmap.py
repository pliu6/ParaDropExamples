import math
import ujson

class Heatmap(object):
    def __init__(self, heatmap_socketio):
        self.heat_map_data = {}
        self.prev_freq = 0
        self.power_step = 0.5  # in dBm
        self.heatmap_socketio = heatmap_socketio

    async def on_new_packet(self, tsf, freq, noise, rssi, powers):
        if freq < self.prev_freq:
            await self.send_data()
            self.heat_map_data = {}

        for subcarrier_freq, power in powers.items():
            power = math.ceil(power * 2.0) / 2.0;
            if subcarrier_freq not in self.heat_map_data:
                self.heat_map_data[subcarrier_freq] = {}

            if power not in self.heat_map_data[subcarrier_freq]:
                self.heat_map_data[subcarrier_freq][power] = 1
            else:
                self.heat_map_data[subcarrier_freq][power] += 1

        self.prev_freq = freq

    async def send_data(self):
        await self.heatmap_socketio.send_heatmap(ujson.dumps(self.heat_map_data))
