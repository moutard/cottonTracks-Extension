'use strict';

/**
 * Allow debug log.
 */

Cotton.Utils.log = function(msg){
   if (Cotton.Config.Parameters.bLoggingEnabled) {
      console.log(msg);
    }
};

Cotton.Utils.debug = function(msg){
   if (Cotton.Config.Parameters.bLoggingEnabled) {
      console.debug(msg);
    }
};

Cotton.Utils.error = function(msg){
      console.error(msg);
};
