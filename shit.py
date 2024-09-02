import os

from pathlib import Path


#removes the "4" in the file names 
#probably overcompliated as shit!

pathlist = Path("./notes").glob('**/*.mp3')
print(pathlist)
for path in pathlist:
    path_in_str = str(path)
    #print(path_in_str.find("4"))
    if path_in_str.find("4") > 0:
        pref = "notes\\"
        fileName = path_in_str[6:len(path_in_str)+1]
        
        #os.remove(path_in_str)
        s = fileName.split(".")
        
        first = s[0]
        newName = pref+first[0:len(first)-1]+"."+s[1]
        #print(first)
        print(path_in_str,newName)
        os.rename(path_in_str,newName)
    # print(path_in_str)