import os, re
from py.compilers.compiler import Compiler

class PREPRODCompiler(Compiler):
  """Default class for all the compiler it contains a lot of usefull methods

  """

  def __init__(self, SOURCE_PATH, DESTINATION_PATH, GOOGLE_CLOSURE_COMPILER):
    self._GOOGLE_CLOSURE_COMPILER = GOOGLE_CLOSURE_COMPILER
    self._PROD_DESTINATION_PATH = os.path.join(DESTINATION_PATH, "preprod")
    Compiler.__init__(self, SOURCE_PATH, self._PROD_DESTINATION_PATH)

    self._dirToRemove = ['behavior', 'config', 'controller', 'core', 'db', 'messaging', 'model', 'py', 'translators', 'ui', 'utils']

  def isLib(self, psFilePath):
    """Return True if the given file is a lib.
    Helpful if you want to know if this file should be compile, or remove etc...
      Args:
        -psFilePath:
    """
    return True if re.search("lib/", psFilePath) or re.search("test/", psFilePath) else False

  def compile(self):
    Compiler.compile(self)
    self.removeUnpreservedFiles()

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

