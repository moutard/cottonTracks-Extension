'use strict';

function CtError() {
    Error.apply(this, arguments);
}

CtError.prototype = new Error();
CtError.prototype.constructor = CtError;
CtError.prototype.name = 'CtError';
