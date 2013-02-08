import os, re, shutil, logging

GOOGLE_CLOSURE_COMPILER = "/usr/local/rmoutard/compiler.jar"
SOURCE_PATH='/usr/local/rmoutard/sz/SubZoom-Proto1/'
DESTINATION_PATH='/usr/local/rmoutard/cottontracks-beta/'

_LOG = logging.getLogger(__name__)

def pretreatment(psSourcePath, psDestinationPath):
  """Given a source path and a destination path, remove the destination path if
  it already exists, then make a copy of source path to destination path.
    Args:
      -psSourcePath:
      -psDestinationPath:
  """
  # Remove old compiled files.
  if os.path.isdir(psDestinationPath):
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


def setPreprodConfig(psConfigFile):
  # TODO(rmoutard): find a better solution.
  os.system("sed -i '' -e 's/.*bDevMode.*/bDevMode:false,/' '%s'" % psConfigFile)
  os.system("sed -i '' -e 's/.*bActiveSumup.*/bActiveSumup:false,/' '%s'" % psConfigFile)
  os.system("sed -i '' -e 's/.*bAnalytics.*/bAnalytics:true,/' '%s'" % psConfigFile)
  os.system("sed -i '' -e 's/.*bLoggingEnabled.*/bLoggingEnabled:true,/' '%s'" % psConfigFile)

def getJavascriptIncludes(psFileName):
  """ Given the name of an html file, find all the lines that includes
  javascript files.
  <script type='text/javascript' src='ui/story/init.js'></script>
    Args:
      -psFileName : location of an html file.
      Ex : "./index.html" or "/usr/local/index.html"
    Return:
      - list of all the src found in this folder.
  """
  llJavacriptIncludes = []
  # Open the file in read mode.
  loIndex = open(psFileName, 'r')
  # For each line find the pattern src=''
  # FIXME(rmoutard) : doesn't work if you put all your script includes on
  # one line.
  for lsLine in loIndex :
    # FIXME(rmoutard) : allow double quote.
    loRegExpResult = re.search('src\=\'(.+\.js)', lsLine)
    if loRegExpResult:
      llJavacriptIncludes.append(loRegExpResult.group(1))
  return llJavacriptIncludes

def isLib(psFilePath):
  """Return True if the given file is a lib.
  Helpful if you want to know if this file should be compile, or remove etc...
    Args:
      -psFilePath:
  """
  return True if re.search("lib/", psFilePath) else False


def getJavascriptIncludesWithoutLib(psFileName):
  """Return only javascript files that are not libraries."""
  llJsIncludes = getJavascriptIncludes(psFileName)
  return [lsFile for lsFile in llJsIncludes if not isLib(lsFile)]

def getExternsFile(psExternsDir):
  """ Given the name of a directory return the list of javascript files in this
  directory.
    Args:
      -psExternsDir: Path of the directory that contains all the externs files.
  """
  llExterns = []
  for files in os.listdir(psExternsDir):
    if files.endswith('.js'):
      llExterns.append(files)
  return ["%s%s" % (psExternsDir, lsFile) for lsFile in llExterns]

def googleCompile(plJavascriptFiles, psOutputFileName="output.min.js"):
  """Use the google closure compiler with specific parameters to merge all
  the plJavascriptFiles and compile them into one single file psOutputFileName.
    Args:
      -plJavascriptFiles
      -psOutputFileName
  """
  COMPILE_COMMAND="java -jar %s" % GOOGLE_CLOSURE_COMPILER
  COMPILE_OPTIONS=[
      "--language_in=ECMASCRIPT5_STRICT",
      "--compilation_level ADVANCED_OPTIMIZATIONS",
      "--jscomp_off=globalThis",
      "--warning_level DEFAULT",
      "--define='DEBUG=false'"
      ]

  EXTERNS= getExternsFile("lib/externs/")

  COMMAND= "%s %s %s %s %s %s" % (COMPILE_COMMAND,
     " ".join(COMPILE_OPTIONS),
     " --externs ".join(EXTERNS),
     " --js ".join(plJavascriptFiles),
     " --js_output_file ",
     psOutputFileName)

  os.system(COMMAND)
  print 'Google closure Compilation of %s - Success' % psOutputFileName

def removeJsIncludesWithSed(psFile, plJavascriptFiles):
  for lsFile in plJavascriptFiles:
    lsPattern = re.escape(lsFile)
    os.system('sed -i "" -e "/%s/d" "%s"' % (lsPattern, psFile))
  print "Useless includes have been removed from %s" % psFile

def addJsIncludeWithSed(psFile, psJsIncludeSrc):
  os.system('sed -i "" -e "/Cotton.config/a\\<script type="text/javascript" src="%s"></script>" "%s"' % (psJsIncludeSrc, psFile))
  print "Add %s to %s" % (psFile, psJsIncludeSrc)

def compileFile(psFile):
  lsOutputFile = "%s.min.js" % psFile.split('.')[0]
  llJsIncludes = getJavascriptIncludesWithoutLib(psFile)
  googleCompile(llJsIncludes, lsOutputFile)
  removeJsIncludesWithSed(psFile, llJsIncludes)
  addJsIncludeWithSed(psFile, lsOutputFile)

if __name__ == '__main__':
  pretreatment(SOURCE_PATH, DESTINATION_PATH)
  os.chdir(DESTINATION_PATH)
  compileFile('index.html')
  compileFile('background.html')


