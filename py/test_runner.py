import os, platform

def runTest():
  sPlatform = platform.system()

  if sPlatform == 'Darwin':
    os.system("open -a Google\ Chrome unit_tests.html")
    os.system("open -a Google\ Chrome algo_test.html")
  if sPlatform == 'Linux':
    os.system("google-chrome unit_tests.html")
    os.system("google-chrome algo_test.html")
  if sPlatform == 'Windows':
    pass;


