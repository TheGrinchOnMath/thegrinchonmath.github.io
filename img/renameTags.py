
import os

basedir = os.getcwd()

for name in os.listdir(basedir):
    fullname = os.path.join(basedir, name)
    if os.path.isfile(fullname):
        newname = name.replace(' ', '').lower()
        if newname != name:
            newfullname = os.path.join(basedir, newname)
            if os.path.exists(newfullname):
                print("Cannot rename " + fullname)
            else:
                os.rename(fullname, newfullname)

