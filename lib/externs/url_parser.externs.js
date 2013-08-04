/**
 * @param {Object|string}
 *          sUrl
 * @return {!_}
 *
 */
function UrlParser(sUrl) {
};

/* Attributs */

/**
 * @type {string}
 */
UrlParser.href;

/**
 * @type {string}
 */
UrlParser.protocol;
/**
 * @type {string}
 */
UrlParser.host;
/**
 * @type {string}
 */
UrlParser.hostname;
/**
 * @type {string}
 */
UrlParser.service;

/**
 * @type {string}
 */
UrlParser.port;

/**
 * @type {string}
 */
UrlParser.country;


/**
 * @type {string}
 */
UrlParser.hostname_without_country;

/**
 * @type {string}
 */
UrlParser.pathname;
/**
 * @type {string}
 */
UrlParser.hash;
/**
 * @type {string}
 */
UrlParser.search;

/**
 * @type {boolean}
 */
UrlParser.isGoogle;

/**
 * @type {boolean}
 */
UrlParser.isGoogleMaps;

/**
 * @type {boolean}
 */
UrlParser.isVimeo;

/**
 * @type {boolean}
 */
UrlParser.isHttps;

/**
 * @type {Object}
 */
UrlParser.dHash;
/**
 * @type {Object}
 */
UrlParser.dSearch;
/**
 * @type {Object}
 */
UrlParser.keywords;
/**
 * @type {string}
 */
UrlParser.searchImage;

/* Prototype */
/**
 * Functional-style annotation
 */
UrlParser.prototype.fineDecomposition = function() {
};

/**
 * Functional-style annotation
 */
UrlParser.prototype.generateKeywords = function() {
};

/**
 * Functional-style annotation
 */
UrlParser.prototype.generateLinkedInKeywords = function() {
};

/**
 * Functional-style annotation
 */
UrlParser.prototype.imageSearchPreviewSource = function() {
};

/**
 * Functional-style annotation
 */
UrlParser.prototype.previousKeywords = function() {
};

UrlParser.prototype.replaceHexa = function() {
};
