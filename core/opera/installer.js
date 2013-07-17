'use strict';

Cotton.Core.Installer = Class.extend({

  _oDatabase : null,

  /**
   * call back method called when the installation is finished.
   */
  _mIsFinished : null,

  init: function(oDatabase, mCallback){
    var self = this;
    self._oDatabase = oDatabase;
    self._mIsFinished = mCallback;

    // When everything is ready call the install.
    self.install();
  },

  /**
   * Install
   *
   * First installation, the database is empty. Need to populate. Then launch,
   * DBSCAN1 on the results.
   *
   */
  install : function(mCallback){
    var self = this;

    // Disable the button and open the howTo page.
    chrome.tabs.create({'url': 'http://www.cottontracks.com/howto.html'});
    DEBUG && console.debug("Controller - install");
    // Set cohort for analytics.
    var date = new Date();
    var month = date.getMonth() + 1;
    // TODO(rmoutard): use a ct-cohort to avoid conflit on local storage.
    localStorage.setItem('cohort', month + "/" + date.getFullYear());
    Cotton.ANALYTICS.setCohort(month + "/" + date.getFullYear());
    self._mIsFinished();
  }

});
