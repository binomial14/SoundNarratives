import sys

def linux_to_windows_path(path_str):
    return "C:\\Users\\"+"\\".join(path_str.split("/")[3:])

sys.path.append(linux_to_windows_path('/c/Users/lyuanwu/Workspace/AudioFlamingo/audio-flamingo/'))
sys.path.append(linux_to_windows_path('/c/Users/lyuanwu/Workspace/AudioFlamingo/audio-flamingo/inference'))

for path in sys.path:
    print(path)

from inference.AudioFlamingoAPI import AudioFlamingoAPI

api = AudioFlamingoAPI()
caption = api.generate_caption('./tmp/tmp.wav')
print(caption)