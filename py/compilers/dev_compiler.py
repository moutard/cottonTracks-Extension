import os
from py.compilers.compiler import Compiler

class DEVCompiler(Compiler):
  """Default class for all the compiler it contains a lot of usefull methods

  """

  def __init__(self, SOURCE_PATH, DESTINATION_PATH, psBrowser):
    self._PROD_DESTINATION_PATH = DESTINATION_PATH
    Compiler.__init__(self, SOURCE_PATH, os.path.join(DESTINATION_PATH, "dev"), psBrowser)

  def compile(self):
    self.pretreatment(self._SOURCE_PATH, self._DESTINATION_PATH)
    os.chdir(self._DESTINATION_PATH)
    Compiler.compile(self)
    self.compileTest()
    self.createIntegrationTests()

  def compileJs(self, plJavascriptFiles, psOutput="output.min.js"):
    if len(plJavascriptFiles) > 0 :
      print "cat %s > %s" % (" ".join(plJavascriptFiles), psOutput)
      os.system("cat %s > %s" % (" ".join(plJavascriptFiles), psOutput))


