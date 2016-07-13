import json, shutil, os

class GlobalConfigs(object):
  """Configs common to all the browsers."""

  def permissions(self):
    """Return the valid for permissions for the current browser."""
    return self._permissions

  def coreDefaultFolder(self):
    """Return the default core default folder."""
    return os.path.join("src", "core", "default")

  def coreFolder(self):
    """Return the folder that contains the current browser core."""
    return os.path.join("src", "core", self._sBrowser)

class OperaConfigs(GlobalConfigs):
  """Configs specific to Opera"""
  def __init__(self):
    self._sBrowser = 'opera'
    self._permissions = ["tabs", "opera://favicon/", "http://*/*", "https://*/*", "history"]

class ChromeConfigs(GlobalConfigs):
  """Configs specific to Chrome."""
  def __init__(self):
    self._sBrowser = 'chrome'
    self._permissions = ["notifications", "tabs", "chrome://favicon/", "http://*/*", "https://*/*", "history"]

class FactoryConfigs(object):
  """Factory that returns the good configuration class depends of the browser.
  Handle also all the browsers lists.
  """

  BROWSER_LIST = ['chrome', 'opera']

  def get(self, psBrowser):
    """Return a config for a specific browser."""
    if psBrowser == 'chrome':
      return ChromeConfigs()
    elif psBrowser == 'opera':
      return OperaConfigs()
    else :
      raise Exception('Browser not supported')

  def getAll(self):
    return [self.get(lsBrowser) for lsBrowser in self.BROWSER_LIST]

  def getAllExcept(self, psBrowser):
    return [self.get(lsBrowser) for lsBrowser in self.BROWSER_LIST if lsBrowser!=psBrowser]

class BrowserHandler(object):
  """Class that handle part of the code that are different depending on the
  browser, and version of the browser.
  Includes :
  - manifest.json Creator
  - core importation
  """
  def __init__(self, psBrowser):
    self._oConfigs = FactoryConfigs().get(psBrowser)

  def _createManifest(self):
    """Manifest depends on the browser.
    - permissions
    """
    psFile = "manifest.json"
    # Open the manifest
    loFile = open(psFile, 'r')
    ldManifest = json.loads(loFile.read())
    loFile.close()
    # Modify permissions.
    ldManifest['permissions'] = self._oConfigs.permissions()
    # Set up the manifest.
    loFile = open(psFile, 'w')
    loFile.write(json.dumps(ldManifest))
    loFile.close()

  def _importCore(self):
    """The core folder is a specific folder that contains a binding to all the
    specific API of a browser.
    To use it copy the right folder to the location default.
    """
    # Remove local default folder if it already exists.
    if os.path.isdir(self._oConfigs.coreDefaultFolder()):
      shutil.rmtree(self._oConfigs.coreDefaultFolder())
    # Copy the selected core to the default folder.
    shutil.copytree(self._oConfigs.coreFolder(), self._oConfigs.coreDefaultFolder())
    for loConfigs in FactoryConfigs().getAll():
      # Remove useless core folder.
      shutil.rmtree(loConfigs.coreFolder())

  def browser_management(self):
    """Launch all the method specific to each browser."""
    self._createManifest()
    self._importCore()

