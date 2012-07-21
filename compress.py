import re, os, shutil

# -- GLOBAL VARIABLES ---------------------------------------------------------
GOOGLE_CLOSURE_COMPILER="/Users/rmoutard/src/google_closure_compiler/compiler.jar"
SOURCE_PATH='/Users/rmoutard/src/SubZoom-Proto1/'
DESTINATION_PATH='/Users/rmoutard/Downloads/'
TAR_NAME = 'cottontracks-beta'
VERSION = '0.1'
TEMP_PATH = DESTINATION_PATH+TAR_NAME+VERSION

def _(sPath):
  """ Use the TEMP_PATH folder to not alterate the current git folder.
  """
  return os.path.join(TEMP_PATH, sPath)

class Compressor:
  """
    Compressor
  """
  COMPILE_COMMAND = "java -jar " + GOOGLE_CLOSURE_COMPILER 
  COMPILE_OPTIONS = [ "--language_in=ECMASCRIPT5_STRICT",
                      "--compilation_level ADVANCED_OPTIMIZATIONS",
                      "--jscomp_off=globalThis",
                      "--warning_level DEFAULT",
                    ]
  COMPILE_EXTERNS = [ "./lib/jquery-1.3.2.externs.js",
                      "./lib/backbone-0.9.2.externs.js",
                      "./lib/underscore-1.3.3.externs.js",
                      "./lib/class.externs.js",
                      "./lib/w3c_indexeddb.externs.js",
                      "./lib/chrome_extensions.externs.js",
                    ]
  COMPILE_IGNORED = [  "./config/ga.js"
                      "./lib/less.js"
                    ]
  COMPILE_LIBRARY = [ "lib/class.js" "lib/jquery.min.js" 
                      "lib/raphael.min.js" 
                      "lib/underscore.min.js" 
                      "lib/backbone.min.js"
                      "lib/date.format.js"
                      "lib/parse_url.js"
                    ]
  def __init__(self, sInputFileName):
    
    self.INCLUDE_FILES=[]
    
    self.pretreatment()
  
    # Detect all the src files include.
    with open(_(sInputFileName), "r") as sources:
      lines = sources.readlines()
      for line in lines:
        result = re.search("src\=\'(.*)\'><", line)
        if result :
          self.INCLUDE_FILES.append(result.group(1))
    
    print self.INCLUDE_FILES
    
    self.compileFile(self.INCLUDE_FILES, "test.html")
  
  def compileFile(self, plInputFiles, psOutPutFile):
    """Use google closure compiler to generate file
    """
    sCompile =  self.COMPILE_COMMAND + " " + \
                " ".join(self.COMPILE_OPTIONS) + \
                " ".join([" --externs " + _(extern) for extern in self.COMPILE_EXTERNS]) + \
                " ".join([" --js " + _(input) for input in plInputFiles]) + \
                " --js_output_file " + _(psOutPutFile)
    print sCompile
            
  def pretreatment(self):
    """Copy files in the direction folder.
    
    """
    shutil.copytree(SOURCE_PATH, TEMP_PATH)
    print "End of pretreatment"
    
  def clean(self):
    pass
    
if __name__ == '__main__':
	oComp = Compressor(_("index.html"))