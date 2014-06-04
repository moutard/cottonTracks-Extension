cottonTracks
============

> **The only browser history you will ever want to keep**

*cottonTracks is an automated and curated record of the best content you experience on your web browser. It replaces your history and bookmarks while maintaining a stunning summary of your insights and influences. Navigate as usual and we take care of organizing your favorite content seamlessly.*


License
-------

    Original idea of Julien Deveaux, Raphaël Korache, Raphaël Moutard, Hadrien Raffalli.
    Please mention them if you use this code.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
  
Compilation
-----------
The compilation process is in charge of:
- minimize code
- start tests
- package code for release

*Disclaimer: compilation scripts works on unix os (mac osx and linux).*

### Required

Before you try to compile make sure you are verifying the following system
requirements:

1. LESS node package
You can download it using npm -node package manager- on a linux os.

``` npm install -g less```

Find more info at http://lesscss.org/

2. Google Closure Compiler
You need a local version of the .jar You can download this file here :
https://developers.google.com/closure/compiler/
*We do not use the google closure compiler API, it allows virtual machines
dedicated to build to compile the product without using internet connexion.*

3. Own Parameters
Copy-Paste py/parameters.py file to a new file in the same folder and called it:
own_parameters.py
Then fill the 3 values: GOOGLE_CLOSURE_COMPILER, SOURCE_PATH, DESTINATION_PATH

Then feel this new file with your own parameters according to the guidelines in
the following comments.
You need to specify your own_parameters.py for the compilation.

*You are now ready to compile the extension.*

### Description
To reduce the size of the code, and increase performances, the compilation
process performed 2 steps for each html file:
 - compile less files into minimized css using node package.
 - group all js together and compile them into minimized js.
 - change src path in html files to new min file.

and also compile worker files. (slightly different from common js files,
see importScript)

The compiling process is also in charge of starting unitests, integration tests
and benchmarks, (see More on Tests section) or removing them for prod packaging.

### Usage
To compile easily all the differents part of of the code we use a python script.
All the python files are in py/ folder. And the main script is called compile.py

``` python compile.py --dev --preprod --prod ```

you need to specify at least one of the compilation mode:

1. DEV Mode:
For each html files, compile less files into css. Put all js files in one single
big files but DO NOT minimize js (to speed compilation for developers.)
Launch unitest in chrome. (you could launch unittest in opera or safari in the
next version of the compiler see branch compilation_v.2.6, not released yet.)
Create also an extension called integration_tests.
Install this unpacked extension in the dev mode browser, to launch all the
integrations tests specific to the browser, algo tests, parser tests and some
benchmark. The extension has right of specific API.

2. PREPROD Mode:
Produce exactly the same code than PROD mode, but tests compiled and minimized
code. Indeed minimization can produce some bugs. Check every thing is correct
before releasing.
Google Closure Compiler need some externs files to avoid to minimize some
specific function (for instance provided by library, we do not minimized
library files.)

3. PROD Mode:
Produce a minimized code, remove all tests files, and py/ folders, package the
code in the zip file. Ready to be uploaded to create the .crx
Rq. The process do not modify the version of the manifest, make sure you
modify it before the PROD compilation.


Tests
-----
There are 3 types of tests:
- unit tests (see unit_tests.html)
- integration tests (see test/integration)
- benchmark tests (see test/benchmark)

All those tests are based on qunit. For each code file there is an equivalent
file in test/js folder that contains unittests.

Code
----

To make your code work on a specific browser on dev you can make a symbolic link
to the version of the core you want.

```
cd <PATH TO YOU PROJET>/extension/core/
ln -s chrome default ```

The extension is written in javascript. All the libraries used are in the folder
lib/

compilation is in python.

