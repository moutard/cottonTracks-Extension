import os, re

def removeWhiteLines(psFile):
  os.system('sed -i "" -e "/^$/d" "%s"' % psFile)

def removeComments(psFile):
  os.system('sed -i "" -e "/<\!--.*-->/d" "%s"' % psFile)

def insert(psFile, psAfterTag, psTextToInsert):
  lsSedCommand = """sed -i '' -e '/%s/i\\
  %s' '%s'""" % (re.escape(psAfterTag), re.escape(psTextToInsert), psFile)
  os.system(lsSedCommand)

def append(psFile, psBeforeTag, psTextToAppend):
  lsSedCommand = """sed -a '' -e '/%s/i\\
  %s' '%s'""" % (re.escape(psBeforeTag), re.escape(psTextToAppend), psFile)
  os.system(lsSedCommand)
  
def replace(psFile, psSearch, psReplace):
  lsSedCommand = """sed -i '' -e 's/%s/%s/' '%s'""" % (re.escape(psSearch),
                                                       re.escape(psReplace),
                                                       psFile)
