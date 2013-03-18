import os, re, shutil, logging, json, zipfile
import py.sed
from py.file_manager import FileManager
from py.precompiler import PreCompiler

class Compiler(FileManager, PreCompiler):
  """Default class for all the compiler it contains a lot of usefull methods

  """

  def __init__(self, SOURCE_PATH, DESTINATION_PATH):
    self._SOURCE_PATH = SOURCE_PATH
    self._DESTINATION_PATH = DESTINATION_PATH
    self._PRESERVED_FILES = []

    self._dirToRemove = []

  def compile(self):
    self.compileHtml('lightyear.html')
    self.compileHtml('background.html')
    self.compileHtml('unit_tests.html')
    self.compileHtml('algo_test.html')
    self.compileWorker('algo/dbscan1/worker.js')
    self.compileWorker('algo/dbscan2/worker_dbscan2.js')
    self.compileWorker('algo/dbscan3/worker_dbscan3.js')
    self.compileManifest('manifest.json')

  def compileJs(self):
    raise NotImplementedError

  def compileHtml(self, psFile):
    lsJsOutput = "%s.min.js" % psFile.split('.')[0]
    lsCssOutput = "%s.min.css" % psFile.split('.')[0]

    llJs, llJsLib, llLess = self.getIncludes(psFile)

    # Compile all the files.
    self.compileJs(llJs, lsJsOutput)
    if len(llLess) > 0:
      self.compileLess(llLess, lsCssOutput)

    # Remove files not compiled.
    self._removeJs(psFile, llJs)
    self._removeLess(psFile)
    py.sed.removeWhiteLines(psFile)
    py.sed.removeComments(psFile)

    # Add new compiled file.
    self.insertCompiledJs(psFile, lsJsOutput)
    if len(llLess) > 0:
      self.insertCompiledCss(psFile, lsCssOutput)
      self._PRESERVED_FILES.append(lsCssOutput)

    # PRESERVED FILES.
    self._PRESERVED_FILES.extend([psFile, lsJsOutput])
    self._PRESERVED_FILES.extend(llJsLib)
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
    llJs = self.getImports(psFile)

    # Remove files not compiled.
    self._removeJs(psFile, llJs)

    # append the right path to the file importScripts
    llFilesWithPath = [os.path.join(os.path.dirname(psFile), lsJs) for lsJs in llJs]

    # add the worker content
    llFilesWithPath.append(psFile)

    # Compile all the files.
    self.compileJs(llFilesWithPath, lsJsOutput)
    os.system("mv %s %s" % (lsJsOutput, psFile))

    # PRESERVED FILES
    self._PRESERVED_FILES.append(psFile)

  def compileManifest(self, psFile):
    loFile = open(psFile, 'r')
    ldManifest = json.loads(loFile.read())
    for i, ldContentScript in enumerate(ldManifest['content_scripts']):
      llLib = [lsFile for lsFile in ldContentScript['js'] if self.isLib(lsFile)]
      llJs = [lsFile for lsFile in ldContentScript['js'] if not self.isLib(lsFile)]
      self.compileJs(llJs, 'content_scripts%s.min.js' % i)
      ldContentScript['js'] = llLib + ['content_scripts%s.min.js' % i,]
      self._PRESERVED_FILES.append('content_scripts%s.min.js' % i)
      self._PRESERVED_FILES.extend(llLib)
    loFile.close()
    loFile = open(psFile, 'w')
    loFile.write(json.dumps(ldManifest))
    loFile.close()

    # PRESERVED FILES
    self._PRESERVED_FILES.append(psFile)

  def isLib(self, psFilePath):
    """Return True if the given file is a lib.
    Helpful if you want to know if this file should be compile, or remove etc...
      Args:
        -psFilePath:
    """
    return True if re.search("lib/", psFilePath) or re.search("http://",psFilePath)  else False

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
    #FIXME(rmoutard): preserved files.
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
      loJsResult = re.search('src\=[\'|\"](.+\.js)', lsLine)
      loLessResult = re.search('href\=[\'|\"](.+\.less)', lsLine)
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

  def removeUnpreservedFiles(self):

    SAVED_FILES =  [os.path.join(self._DESTINATION_PATH, lsPath) for lsPath in self._PRESERVED_FILES]
    DIR_TO_SAVE = ['media']
    SAVED_EXTENSIONS = ['.jpg', '.png', '.ttf', '.gif']

    for path, dirs, files in os.walk(self._DESTINATION_PATH):
      i = len(files)
      for lsFile in files:
        lsFilePath = os.path.join(path, lsFile)
        fileName, fileExtension = os.path.splitext(lsFilePath)
        if not (lsFilePath in SAVED_FILES) and not fileExtension in SAVED_EXTENSIONS:
          os.remove(lsFilePath)
          i-=1
        # There was no sub folders and I removed all the files.
        if (i==0) and len(dirs) == 0:
          shutil.rmtree(path)
    for lsDir in self._dirToRemove:
      try:
        shutil.rmtree(os.path.join(self._DESTINATION_PATH, lsDir))
      except OSError:
        pass

  def createIntegrationTests(self):
    pass
