import os

from pathlib import Path

pathlist = Path("./piano-mp3").glob('**/*.mp3')

for path in pathlist:
    path_in_str = str(path)
    print(path_in_str.find("4"))
    if path_in_str.find("4") < 0:
        os.remove(path_in_str)
    # print(path_in_str)