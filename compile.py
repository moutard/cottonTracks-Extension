import argparse
from py.sed import *
from py.test_runner import runTest
from py.compilers.prod_compiler import PRODCompiler
from py.compilers.dev_compiler import DEVCompiler

GOOGLE_CLOSURE_COMPILER = "/usr/local/rmoutard/compiler.jar"
SOURCE_PATH='/usr/local/rmoutard/sz/SubZoom-Proto1/'
DESTINATION_PATH='/usr/local/rmoutard/cottontracks-beta/'

#GOOGLE_CLOSURE_COMPILER = "/Users/rmoutard/src/google_closure_compiler/compiler.jar"
#SOURCE_PATH='/Users/rmoutard/src/SubZoom-Proto1'
#DESTINATION_PATH='/Users/rmoutard/src/ct-compiled'

def compileProject(pbPRODMode, pbDEVMode):
  """Given a directory where the project is, compress all the js and less
  files replace the includes in the worker and html. Remove useless files.
    Args:
      - lsOption :
      "PROD" generate a extremely compiled code with a tar.gz you only need to upload.,
      "DEV" generate a code partialy compiled so debug is easyier,
      "ALL" generate both version in 2 differents directories.
  """
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
  compileProject(args.PROD, args.DEV)
