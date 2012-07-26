'use strict';
/**
 * Get Visit Item Worker
 *
 * Workers are in charge of parallelize task.
 */

// Worker has no access to external librairies loaded in the main thread.
// Cotton.lib.
importScripts('../../lib/class.js');
importScripts('../../lib/underscore.js');

importScripts('../../init.js');

// Cotton.config
importScripts('../../config/init.js');
importScripts('../../config/config.js');

// Cotton.db.
importScripts('../../db/init.js');
importScripts('../../db/engine.js');
importScripts('../../db/translator.js');
importScripts('../../db/store.js');

// Cotton.model
importScripts('../../model/init.js');
importScripts('../../model/extracted_dna.js');
importScripts('../../model/visit_item.js');

importScripts('../../translators/init.js');
importScripts('../../translators/visit_item_translators.js');

