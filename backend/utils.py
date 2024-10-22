import time

def get_current_time():
    return int(round(time.time()*1000))

def display_loading_dots():
    while 1:
        print('.',end='\r')
        time.sleep(0.1)
        print('..',end='\r')
        time.sleep(0.1)
        print('...',end='\r')
        time.sleep(0.1)

def linux_to_windows_path(path_str):
    return "C:\\Users\\"+"\\".join(path_str.split("/")[3:])