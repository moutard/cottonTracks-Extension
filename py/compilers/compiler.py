import os, re, shutil, logging, json
import py.sed
from py.precompile import PreCompiler

class Compiler(PreCompiler):
  """Default class for all the compiler it contains a lot of usefull methods

  """

  def __init__(self, SOURCE_PATH, DESTINATION_PATH):
    self._SOURCE_PATH = SOURCE_PATH
    self._DESTINATION_PATH = DESTINATION_PATH

  def compile(self):
    self.pretreatment(self._SOURCE_PATH, self._DESTINATION_PATH)
    os.chdir(self._DESTINATION_PATH)
    self.compileHtml('index.html')
    self.compileHtml('background.html')
    self.compileManifest('manifest.json')

  def compileJs(self):
    raise NotImplementedError

  def compileHtml(self, psFile):
    lsJsOutput = "%s.min.js" % psFile.split('.')[0]
    lsCssOutput = "%s.min.css" % psFile.split('.')[0]

    llJs, llJsLib, llLess = self.getIncludes(psFile)

    # Compile all the files.
    self.compileJs(llJs, lsJsOutput)
    self.compileLess(llLess, lsCssOutput)

    # Remove files not compiled.
    self._removeJs(psFile, llJs)
    self._removeLess(psFile)
    py.sed.removeWhiteLines(psFile)
    py.sed.removeComments(psFile)

    # Add new compiled file.
    self.insertCompiledJs(psFile, lsJsOutput)
    self.insertCompiledCss(psFile, lsCssOutput)

    print 'Total compilation of %s - SUCCESS' %  psFile

  def compileLess(self, plLessFiles, psOutput="output.min.css"):
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

  def compileWorker(self, psFile):
    lsJsOutput = "%s.min.js" % psFile.split('.')[0]
    llJs = getImports(psFile)

    # Remove files not compiled.
    self._removeJs(psFile, llJs)

    # Compile all the files.
    self.compileJs([os.path.join(os.path.dirname(psFile), lsJs) for lsJs in llJs], lsJsOutput)
    os.system("mv %s %s" % (lsJsOutput, psFile))

  def compileManifest(self, psFile):
    loFile = open(psFile, 'r')
    ldManifest = json.loads(loFile.read())
    for i, ldContentScript in enumerate(ldManifest['content_scripts']):
      lsLib = [lsFile for lsFile in ldContentScript['js'] if self.isLib(lsFile)]
      lsJs = [lsFile for lsFile in ldContentScript['js'] if not self.isLib(lsFile)]
      self.compileJs(lsJs, 'content_scripts%s.min.js' % i)
      ldContentScript['js'] = lsLib + ['content_scripts%s.min.js' % i,]
    loFile.close()
    loFile = open(psFile, 'w')
    loFile.write(json.dumps(ldManifest))
    loFile.close()

  def isLib(self, psFilePath):
    """Return True if the given file is a lib.
    Helpful if you want to know if this file should be compile, or remove etc...
      Args:
        -psFilePath:
    """
    return True if re.search("lib/", psFilePath) else False

  def _removeJs(self, psFile, plJsFiles):
    """Remove all the lines of psFiles that matched one of the files in plJsFiles.
      Args:
        -psFile: path of the file.
        -plJsFiles: list of the files you want to remove in the previous file.
    """
    for lsFile in plJsFiles:
      lsPattern = re.escape(lsFile)
      os.system('sed -i "" -e "/%s/d" "%s"' % (lsPattern, psFile))

  def _removeLess(self, psFile):
    """Remove all the lines that contains the pattern .less
    And remove the less.js includes.
    Maybe to large, but simpler and faster that remove each files one by one.
    """
    os.system('sed -i "" -e "/\.less/d" "%s"' % psFile)
    os.system('sed -i "" -e "/less\.js/d" "%s"' % psFile)

  def getImports(self, psFile):
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
        if(not self.isLib(loJsResult.group(1))):
          llJsImports.append(loJsResult.group(1))

    loFile.close()
    return llJsImports

  def getIncludes(self, psFile):
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
        if(self.isLib(loJsResult.group(1))):
          llJsLibIncludes.append(loJsResult.group(1))
        else:
          llJsIncludes.append(loJsResult.group(1))
      elif loLessResult:
        llLessIncludes.append(loLessResult.group(1))

    loFile.close()
    return llJsIncludes, llJsLibIncludes, llLessIncludes

  def getExternsFile(self, psExternsDir):
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


  def insertCompiledJs(self, psFile, psCompiledJs):
    lsSedCommand = """sed -i '' -e '/<\/body>/i\\
    <script type="text/javascript" src="%s"></script>' '%s'""" % (psCompiledJs, psFile)
    os.system(lsSedCommand)

  def insertCompiledCss(self, psFile, psCompiledCss):
    lsSedCommand = """sed -i '' -e '/<head>/a\\
    <link rel="stylesheet" type="text/css" href="%s"/>' '%s'""" % (psCompiledCss, psFile)
    os.system(lsSedCommand)



