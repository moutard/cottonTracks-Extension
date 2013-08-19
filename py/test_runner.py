import os, platform

def runTest():
  sPlatform = platform.system()

  if sPlatform == 'Darwin':
    os.system("open -a Google\ Chrome unit_tests.html")
  if sPlatform == 'Linux':
    os.system("google-chrome unit_tests.html")
  if sPlatform == 'Windows':
    pass;


