import os, re, shutil, logging

GOOGLE_CLOSURE_COMPILER = "/usr/local/rmoutard/compiler.jar"
SOURCE_PATH='/usr/local/rmoutard/sz/SubZoom-Proto1/'
DESTINATION_PATH='/usr/local/rmoutard/cottontracks-beta/'

#GOOGLE_CLOSURE_COMPILER = "/Users/rmoutard/src/google_closure_compiler/compiler.jar"
#SOURCE_PATH='/Users/rmoutard/src/SubZoom-Proto1'
#DESTINATION_PATH='/Users/rmoutard/src/ct-compiled'

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

def getIncludes(psFile):
  """ Given the name of an html file, find all the lines that includes
  javascript files and lines that includes less files.
  <script type='text/javascript' src='ui/story/init.js'></script>
    Args:
      -psFile : location of an html file.
      Ex : "./index.html" or "/usr/local/index.html"
    Return:
      - list of all the js src found in this file.
      - list of all the js lib src found in this file.
      - list of all the less href in this file.
  """
  llJsIncludes = []
  llJsLibIncludes = []
  llLessIncludes = []

  # Open the file in read mode.
  loFile = open(psFile, 'r')
  # For each line find the pattern src=''
  # FIXME(rmoutard) : doesn't work if you put all your script includes on
  # one line.
  for lsLine in loFile :
    # FIXME(rmoutard) : allow double quote.
    loJsResult = re.search('src\=\'(.+\.js)', lsLine)
    loLessResult = re.search('href\=\"(.+\.less)', lsLine)
    if loJsResult:
      if(isLib(loJsResult.group(1))):
        llJsLibIncludes.append(loJsResult.group(1))
      else:
        llJsIncludes.append(loJsResult.group(1))
    elif loLessResult:
      llLessIncludes.append(loLessResult.group(1))

  loFile.close()
  return llJsIncludes, llJsLibIncludes, llLessIncludes

def getImports(psFile):
  """ Given the name of an js file, find all the lines that includes
  javascript files and lines that includes less files.
  importScripts('../../lib/underscore.js');
    Args:
      -psFile : location of a js file.
      Ex : "./index.html" or "/usr/local/index.html"
    Return:
      - list of all the js src found in this file.
  """
  llJsImports = []

  # Open the file in read mode.
  loFile = open(psFile, 'r')
  # For each line find the pattern src=''
  # FIXME(rmoutard) : doesn't work if you put all your script includes on
  # one line.
  for lsLine in loFile :
    # FIXME(rmoutard) : allow double quote.
    loJsResult = re.search('importScripts\(\'(.+\.js)', lsLine)
    if loJsResult:
      if(not isLib(loJsResult.group(1))):
        llJsImports.append(loJsResult.group(1))

  loFile.close()
  return llJsImports


def isLib(psFilePath):
  """Return True if the given file is a lib.
  Helpful if you want to know if this file should be compile, or remove etc...
    Args:
      -psFilePath:
  """
  return True if re.search("lib/", psFilePath) else False

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

def simpleCompileJs(plJavascriptFiles, psOutput="output.min.js"):
  if len(plJavascriptFiles) > 0 :
    print "cat %s > %s" % (" ".join(plJavascriptFiles), psOutput)
    os.system("cat %s > %s" % (" ".join(plJavascriptFiles), psOutput))

def compileJs(plJavascriptFiles, psOutputFileName="output.min.js"):
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

  print 'JS  Compilation of %s - START' % psOutputFileName
  if len(plJavascriptFiles) > 0:
    os.system(COMMAND)
  print 'JS  Compilation of %s - SUCCESS' % psOutputFileName

def compileLess(plLessFiles, psOutput="output.min.css"):
  """For each less file create a css file, then merge all those css files
  in the same file.
    Args:
      -plLessFiles: list of less files.
      -psOutput: path of the output.
  """
  llTempCssFiles = []
  for lsLessFile in plLessFiles:
    lsCssFile = "%s.min.css" % lsLessFile.split(".")[0]
    llTempCssFiles.append(lsCssFile)
    lsCommand = "lessc -x %s > %s" % (lsLessFile, lsCssFile)
    print lsCommand
    os.system(lsCommand)

  # Merge all the css files.
  if len(llTempCssFiles) > 0 :
    print "cat %s > %s" % (" ".join(llTempCssFiles), psOutput)
    os.system("cat %s > %s" % (" ".join(llTempCssFiles), psOutput))

  # Remove temp files.
  for lsTempFile in llTempCssFiles:
    os.remove(lsTempFile)
  print "CSS Compilation of %s - SUCCESS" % psOutput
  return psOutput


def removeJs(psFile, plJsFiles):
  """Remove all the lines of psFiles that matched one of the files in plJsFiles.
    Args:
      -psFile: path of the file.
      -plJsFiles: list of the files you want to remove in the previous file.
  """
  for lsFile in plJsFiles:
    lsPattern = re.escape(lsFile)
    os.system('sed -i "" -e "/%s/d" "%s"' % (lsPattern, psFile))

def removeLess(psFile):
  """Remove all the lines that contains the pattern .less
  And remove the less.js includes.
  Maybe to large, but simpler and faster that remove each files one by one.
  """
  os.system('sed -i "" -e "/\.less/d" "%s"' % psFile)
  os.system('sed -i "" -e "/less\.js/d" "%s"' % psFile)

def removeWhiteLines(psFile):
  os.system('sed -i "" -e "/^$/d" "%s"' % psFile)

def removeComments(psFile):
  os.system('sed -i "" -e "/<\!--.*-->/d" "%s"' % psFile)

def insertCompiledJs(psFile, psCompiledJs):
  lsSedCommand = """sed -i '' -e '/<\/head>/i\\
  <script type="text/javascript" src="%s"></script>' '%s'""" % (psCompiledJs, psFile)
  os.system(lsSedCommand)

def insertCompiledCss(psFile, psCompiledCss):
  lsSedCommand = """sed -i '' -e '/<\/head>/i\\
  <link rel="stylesheet" type="text/css" href="%s"/>' '%s'""" % (psCompiledCss, psFile)
  os.system(lsSedCommand)

def compileHtml(psFile):
  lsJsOutput = "%s.min.js" % psFile.split('.')[0]
  lsCssOutput = "%s.min.css" % psFile.split('.')[0]

  llJs, llJsLib, llLess = getIncludes(psFile)

  # Compile all the files.
  #compileJs(llJs, lsJsOutput)
  simpleCompileJs(llJs, lsJsOutput)
  compileLess(llLess, lsCssOutput)

  # Remove files not compiled.
  removeJs(psFile, llJs)
  removeLess(psFile)
  removeWhiteLines(psFile)
  removeComments(psFile)

  # Add new compiled files.
  insertCompiledJs(psFile, lsJsOutput)
  insertCompiledCss(psFile, lsCssOutput)

  print 'Total compilation of %s - SUCCESS' %  psFile

def compileWorker(psFile):
  lsJsOutput = "%s.min.js" % psFile.split('.')[0]
  llJs = getImports(psFile)

  # Remove files not compiled.
  removeJs(psFile, llJs)

  # Compile all the files.
  compileJs([os.path.join(os.path.dirname(psFile), lsJs) for lsJs in llJs], lsJsOutput)
  os.system("mv %s %s" % (lsJsOutput, psFile))

def compileProject():
  """Given a directory where the project is, compress all the js and less
  files replace the includes in the worker and html. Remove useless files.
  """
  pretreatment(SOURCE_PATH, DESTINATION_PATH)
  os.chdir(DESTINATION_PATH)
  compileHtml('index.html')
  compileHtml('background.html')


if __name__ == '__main__':
  compileProject()
