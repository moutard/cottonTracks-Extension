import argparse
from py.sed import *
from py.test_runner import runTest
from py.precompile import PreCompiler
from py.compilers.prod_compiler import PRODCompiler
from py.compilers.dev_compiler import DEVCompiler

GOOGLE_CLOSURE_COMPILER = "/usr/local/rmoutard/compiler.jar"
SOURCE_PATH='/usr/local/rmoutard/sz/SubZoom-Proto1/'
DESTINATION_PATH='/usr/local/rmoutard/cottontracks-beta/'

#GOOGLE_CLOSURE_COMPILER = "/Users/rmoutard/src/google_closure_compiler/compiler.jar"
#SOURCE_PATH='/Users/rmoutard/src/SubZoom-Proto1'
#DESTINATION_PATH='/Users/rmoutard/src/ct-compiled'

class ProjectCompiler(PreCompiler):

  def __init__(self, pbPRODMode, pbDEVMode, pbForce):

    self._SOURCE = SOURCE_PATH
    self._LIB = os.path.join(SOURCE_PATH, 'lib')
    self._EXTERNS = os.path.join(SOURCE_PATH, 'lib', 'externs')
    self.removeOld(DESTINATION_PATH, pbForce)

    if(pbPRODMode):
      loPRODCompiler = PRODCompiler(SOURCE_PATH, DESTINATION_PATH, GOOGLE_CLOSURE_COMPILER)
      loPRODCompiler.compile()
    if(pbDEVMode):
      loDEVCompiler = DEVCompiler(SOURCE_PATH, DESTINATION_PATH)
      loDEVCompiler.compile()


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Compile the project.')
  parser.add_argument('--dev',  dest='DEV', action='store_true',
      help='compile in DEV mode')
  parser.add_argument('--prod', dest='PROD',action='store_true',
      help='compile in PROD mode')
  parser.add_argument('--f', dest='FORCE',action='store_true',
      help='force the compilation. do not ask permission to remove old version.')

  args = parser.parse_args()
  if(not args.PROD and not args.DEV):
    parser.error('No MODE precised, please provide --dev, --prod or both')
  ProjectCompiler(args.PROD, args.DEV, args.FORCE)
