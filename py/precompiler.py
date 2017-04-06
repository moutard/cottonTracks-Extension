from py.sed import *
import pdb;

class PreCompiler(object):

  def setPreprodConfig(self, psConfigFile):
    # TODO(rmoutard): find a better solution.
    os.system("sed -i '' -e 's/.*bDevMode.*/bDevMode:false,/' '%s'" % psConfigFile)
    os.system("sed -i '' -e 's/.*bActiveSumup.*/bActiveSumup:false,/' '%s'" % psConfigFile)
    os.system("sed -i '' -e 's/.*bAnalytics.*/bAnalytics:true,/' '%s'" % psConfigFile)
    os.system("sed -i '' -e 's/.*bLoggingEnabled.*/bLoggingEnabled:true,/' '%s'" % psConfigFile)

  def setVersion(self):
    pass

  def setProdConfig(self, psConfigFile):
    # TODO(rmoutard): find a better solution.
    os.system("sed -i '' -e 's/.*bDevMode.*/bDevMode:false,/' '%s'" % psConfigFile)
    os.system("sed -i '' -e 's/.*bActiveSumup.*/bActiveSumup:false,/' '%s'" % psConfigFile)
    os.system("sed -i '' -e 's/.*bAnalytics.*/bAnalytics:true,/' '%s'" % psConfigFile)
    os.system("sed -i '' -e 's/.*bLoggingEnabled.*/bLoggingEnabled:false,/' '%s'" % psConfigFile)


