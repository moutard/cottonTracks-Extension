(function() {
    var module = '',
        test = '',
        lastModuleLogged = '',
        lastTestLogged = '',
        failuresOnCurrentTest = 0,
        failureFound = false;

    QUnit.moduleStart(function(details) {
        module = details.name;
    });
    QUnit.testStart(function(details) {
        test = details.name;
    });

    QUnit.log(function(details) {
        if (!details.result) {
            if (!failureFound) {
                failureFound = true;
                console.log('');
                console.log('/**********************************************/');
                console.log('/*************** FAILURE SUMMARY **************/');
                console.log('/**********************************************/');
            }
            if (lastModuleLogged != module) {
                console.log('');
                console.log('------------------------------------------------');
                console.log('Module: ' + module);
            }

            if (lastTestLogged != test) {
                failuresOnCurrentTest = 1;
                console.log('------------------------------------------------');
                console.log('Test: ' + test);
            } else {
                failuresOnCurrentTest++;
            }

            console.error(' ' + failuresOnCurrentTest + ') Message: ' + details.message);
            if (typeof details.expected !== 'undefined') {
                console.log('    Expected: ' + details.expected);
                console.log('    Actual: ' + details.actual);
            }
            if (typeof details.source !== 'undefined') {
                console.log('    Source: ' + details.source);
            }

            lastModuleLogged = module;
            lastTestLogged = test;
        }
    });

    QUnit.done(function(details) {
        if (details.failed > 0) {
            console.log('----------------------------------------------------');
            console.log('');
        } else {
                console.log('');
                console.log('/**********************************************/');
                console.log('/*************** TESTS SUCCEED ****************/');
                console.log('/**********************************************/');
            }

    });
}());

