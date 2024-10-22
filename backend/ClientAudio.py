import queue 

from utils import get_current_time

class ClientAudio():
    def __init__(self, thread, socket, api):
        self.isOn = False
        self._thread = thread
        self._socket = socket
        self._af_wrapper = api

        self.start_time = get_current_time()
        self.buff = queue.Queue()
        self.frames = []

    def start(self):
        self.isOn = True
        self._thread.start()
    
    def close(self):
        self.isOn = False
        self.buff.put(None)
        self._thread.join()

    def add_data(self, data):
        self.buff.put(data)

    def generator(self):
        while self.isOn:
            data = []
            chunk = self.buff.get()
            if chunk is None:
                return
            data.append(chunk)
            self.frames.append(chunk)

            while True:
                try:
                    chunk = self.buff.get(block=False)
                    if chunk is None:
                        return
                    data.append(chunk)
                    self.frames.append(chunk)
                except queue.Empty:
                    break
            yield b"".join(data)

    def generate_caption(self,filepath,config):
        return self._af_wrapper.generate_caption(filepath,config)
        # return self._af_wrapper.inference(filepath,"What do you hear in this audio?")

    # async def send_client_data(self, data_type, spkr, data, is_final: bool):
    #     await self._socket.emit(data_type, {'speaker_id': spkr, 'data': data, 'isFinal': is_final})
    
    async def send_client_data(self, data_type, data):
        await self._socket.emit(data_type, {'data': data})

    async def send_caption_data(self, data_type, data):
        await self._socket.emit('captionData', {'data': data})