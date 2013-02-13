import shutil, os
from py.sed import *

class PreCompiler(object):

  def setPreprodConfig(self, psConfigFile):
    # TODO(rmoutard): find a better solution.
    os.system("sed -i '' -e 's/.*bDevMode.*/bDevMode:false,/' '%s'" % psConfigFile)
    os.system("sed -i '' -e 's/.*bActiveSumup.*/bActiveSumup:false,/' '%s'" % psConfigFile)
    os.system("sed -i '' -e 's/.*bAnalytics.*/bAnalytics:true,/' '%s'" % psConfigFile)
    os.system("sed -i '' -e 's/.*bLoggingEnabled.*/bLoggingEnabled:true,/' '%s'" % psConfigFile)

  def pretreatment(self, psSourcePath, psDestinationPath):
    """Given a source path and a destination path, remove the destination path if
    it already exists, then make a copy of source path to destination path.
      Args:
        -psSourcePath:
        -psDestinationPath:
    """
    # Remove old compiled files.
    if os.path.isdir(psDestinationPath):
      print psDestinationPath
      loResponse = raw_input("An old version has been found, do you want to remove it ? (y/n)")
      if loResponse == "y":
        shutil.rmtree(psDestinationPath)
      else:
        raise
        print "End. Can't go further."

    try:
      shutil.copytree(psSourcePath, psDestinationPath)
    except OSError as exc: # python >2.5
      raise
    # Go on pretreatment.
    os.chdir(psDestinationPath)

