import json

class GlobalConfigs(object):
  """Configs common to all the browsers."""
  def permissions(self):
    return self._permissions
  def coreFolder(self):
    return self._coreFolder

class OperaConfigs(GlobalConfigs):
  """Configs specific to Opera"""
  def __init__(self):
    self._permissions = ["tabs", "opera://favicon/", "http://*/*", "https://*/*"]
    self._coreFolder = "core/opera/"

class ChromeConfigs(GlobalConfigs):
  """Configs specific to Chrome."""
  def __init__(self):
    self._permissions = ["tabs", "chrome://favicon/", "http://*/*", "https://*/*", "history"]
    self._coreFolder = "core/chrome/"

class BrowserHandler(object):
  """Class that handle part of the code that are different depending on the
  browser, and version of the browser.
  Includes :
  - manifest.json Creator
  - core importation
  """

  BROWSER_SUPPORTED = ['chrome', 'opera']

  def __init__(self, psBrowser):
    if psBrowser in self.BROWSER_SUPPORTED:
      self._BROWSER = psBrowser
      self._oConfigs = self._getConfigs()
    else :
      raise Exception('Browser not supported')

  def _getConfigs(self):
    if self._BROWSER == "chrome":
      return ChromeConfigs()
    elif self._BROWSER == "opera":
      return OperaConfigs()


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

  def browser_management(self):
    self._createManifest()

