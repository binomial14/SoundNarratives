import asyncio
import threading

from ClientAudio import ClientAudio
from GoogleSpeechRecognition import google_speech_recognition
from AFInference import af_model_inference

clients = {}

class SystemWrapper:
    async def start_client(c_id,socket,config,api,LOGGER):
        if c_id not in clients.keys():
            client = ClientAudio(threading.Thread(target=asyncio.run, args=(SystemWrapper.sound_caption(c_id,config,LOGGER),)),socket,api)
            client.start()
            clients[c_id] = client
        else:
            LOGGER.info("Warning! Client id {c_id} exists!")
    
    async def speech_recognition(c_id,config,LOGGER):
        client = clients[c_id]
        while client.isOn:
            await google_speech_recognition(client,config,LOGGER)

    async def sound_caption(c_id,config,LOGGER):
        client = clients[c_id]
        while client.isOn:
            await af_model_inference(client,config,LOGGER)
    
    async def stop_client(c_id):
        if c_id in clients.keys():
            clients[c_id].close()
            del clients[c_id]
    
    def receive_audio_data(c_id, audio_data):
        if c_id not in clients.keys():
            return
        
        clients[c_id].add_data(audio_data)
