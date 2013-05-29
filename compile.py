import argparse
from py.sed import *
from py.test_runner import runTest
from py.file_manager import FileManager
from py.precompiler import PreCompiler
from py.compilers.prod_compiler import PRODCompiler
from py.compilers.preprod_compiler import PREPRODCompiler
from py.compilers.dev_compiler import DEVCompiler
from py.own_parameters import *

class ProjectCompiler(FileManager, PreCompiler):

  def __init__(self, psBrowser, pbPRODMode, pbPREPRODMode, pbDEVMode,  pbForce):

    self._SOURCE = SOURCE_PATH
    self._LIB = os.path.join(SOURCE_PATH, 'lib')
    self._EXTERNS = os.path.join(SOURCE_PATH, 'lib', 'externs')
    self.removeOld(DESTINATION_PATH, pbForce)

    if(pbPRODMode):
      loPRODCompiler = PRODCompiler(SOURCE_PATH, DESTINATION_PATH, GOOGLE_CLOSURE_COMPILER, psBrowser)
      loPRODCompiler.compile()
    if(pbPREPRODMode):
      loPREPRODCompiler = PREPRODCompiler(SOURCE_PATH, DESTINATION_PATH, GOOGLE_CLOSURE_COMPILER, psBrowser)
      loPREPRODCompiler.compile()
      runTest()
    if(pbDEVMode):
      loDEVCompiler = DEVCompiler(SOURCE_PATH, DESTINATION_PATH, psBrowser)
      loDEVCompiler.compile()
      runTest()



if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Compile the project.')
  parser.add_argument('-b', '--browser', dest='browser', default="chrome",
      help='browser supported are "chrome", "opera"')
  parser.add_argument('--dev',  dest='DEV', action='store_true',
      help='compile in DEV mode')
  parser.add_argument('--prod', dest='PROD',action='store_true',
      help='compile in PROD mode')
  parser.add_argument('--preprod', dest='PREPROD',action='store_true',
      help='compile in PREPROD mode')

  parser.add_argument('-f', '--force', dest='FORCE',action='store_true',
      help='force the compilation. do not ask permission to remove old version.')

  args = parser.parse_args()
  if(not args.PROD and not args.DEV and not args.PREPROD):
    parser.error('No MODE precised, please provide --dev, --prod or both')
  else:
    ProjectCompiler(args.browser, args.PROD, args.PREPROD, args.DEV, args.FORCE)
