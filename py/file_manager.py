import shutil, os, zipfile
from shutil import make_archive

class FileManager(object):

  def removeOld(self, psDestinationPath, pbForce):
    # Remove old compiled files.
    if os.path.isdir(psDestinationPath):
      if not pbForce:
        print psDestinationPath
        loResponse = raw_input("An old version has been found, do you want to remove it ? (y/n)")
        if loResponse == "y":
          shutil.rmtree(psDestinationPath)
        else:
          raise
          print "End. Can't go further."
      else :
        shutil.rmtree(psDestinationPath)

    os.mkdir(psDestinationPath)

  def copySourceToDestinationWithoutHidden(self, psSourcePath, psDestinationPath):
    try:
      os.mkdir(psDestinationPath)
      # hidden
      lNoHiddenFolders =  [x for x in os.listdir(psSourcePath) if x[0]!="."]
      for sFolder in lNoHiddenFolders:
        if os.path.isfile(os.path.join(psSourcePath, sFolder)):
          shutil.copy(os.path.join(psSourcePath, sFolder), os.path.join(psDestinationPath, sFolder))
        else:
          shutil.copytree(
            os.path.join(psSourcePath, sFolder),
            os.path.join(psDestinationPath, sFolder))
    except OSError as exc: # python >2.5
      raise
    # Go on pretreatment.
    os.chdir(psDestinationPath)

  def zip(self, psFolder, psZip):
    """Zip the folder and in the zip name.
      Args:
        - psFolder: folder to zip.
        - psZip: path with name of the zip.
    """
    make_archive(psZip, 'zip', psFolder)

  def pretreatment(self, psSourcePath, psDestinationPath):
    """Given a source path and a destination path, remove the destination path if
    it already exists, then make a copy of source path to destination path.
      Args:
        -psSourcePath:
        -psDestinationPath:
    """
    # Remove old compiled files.
    if os.path.isdir(psDestinationPath):
      print psDestinationPath
      loResponse = raw_input("An old version has been found, do you want to remove it ? (y/n)")
      if loResponse == "y":
        shutil.rmtree(psDestinationPath)
      else:
        raise
        print "End. Can't go further."

    try:
      self.copySourceToDestinationWithoutHidden(psSourcePath, psDestinationPath)
      # shutil.copytree(psSourcePath, psDestinationPath)
    except OSError as exc: # python >2.5
      raise
    # Go on pretreatment.
    os.chdir(psDestinationPath)
    #shutil.rmtree(".git")
    #os.remove(".gitignore")
    #os.remove(".pydevproject")
