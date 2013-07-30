import os
from py.compilers.compiler import Compiler

class PRODCompiler(Compiler):
  """Default class for all the compiler it contains a lot of usefull methods

  """

  def __init__(self, SOURCE_PATH, DESTINATION_PATH, GOOGLE_CLOSURE_COMPILER, psBrowser):
    self._GOOGLE_CLOSURE_COMPILER = GOOGLE_CLOSURE_COMPILER
    self._PROD_DESTINATION_PATH = os.path.join(DESTINATION_PATH, "prod")
    Compiler.__init__(self, SOURCE_PATH, self._PROD_DESTINATION_PATH, psBrowser)

    self._dirToRemove = ['behavior', 'config', 'controller', 'core', 'db', 'messaging', 'model', 'py', 'test', 'translators', 'ui', 'utils', 'management']

  def compile(self):
    self.pretreatment(self._SOURCE_PATH, self._DESTINATION_PATH)
    os.chdir(self._DESTINATION_PATH)
    self.setProdConfig(os.path.join(self._DESTINATION_PATH, 'config/config.js'))
    Compiler.compile(self)

    self.removeUnpreservedFiles()
    self.zip(self._PROD_DESTINATION_PATH, os.path.join(self._PROD_DESTINATION_PATH, '..', 'cottontracks.zip'))

  def compileJs(self, plJavascriptFiles, psOutputFileName="output.min.js"):
    """Use the google closure compiler with specific parameters to merge all
    the plJavascriptFiles and compile them into one single file psOutputFileName.
      Args:
        -plJavascriptFiles
        -psOutputFileName
    """
    COMPILE_COMMAND="java -jar %s" % self._GOOGLE_CLOSURE_COMPILER
    COMPILE_OPTIONS=[
        "--language_in=ECMASCRIPT5_STRICT",
        "--compilation_level ADVANCED_OPTIMIZATIONS",
        "--jscomp_off=globalThis",
        "--warning_level DEFAULT",
        "--define='DEBUG=false'"
        ]

    EXTERNS= self.getExternsFile("lib/externs/")

    COMMAND= "%s %s %s %s %s %s" % (COMPILE_COMMAND,
       " ".join(COMPILE_OPTIONS),
       " --externs ".join(EXTERNS),
       " --js ".join(plJavascriptFiles),
       " --js_output_file ",
       psOutputFileName)

    print 'JS  Compilation of %s - START' % psOutputFileName
    if len(plJavascriptFiles) > 0:
      os.system(COMMAND)
    print 'JS  Compilation of %s - SUCCESS' % psOutputFileName

