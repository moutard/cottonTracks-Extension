cottonTracks Architecture
=========================

cottonTracks was developed in 2010, frameworks like angular or react were not mature
or didn't exist.
So the team decided to work without any framework. It may seems more complex, but
it also provides a lot of flexibility.

And the application is also really light, as it doesn't depend on a huge framework
like angular.

We follow a strict MVC pattern. That are order in 3 main folders.

- model
    Contains all the Model class. A Model is like a slightly advanced POJO. It
    contains all the attributes of the object, then setters ang getters. (1)
    It also contains some more advanced features in some specific cases.

- controller
   That's the main part of the app. That's where we decide what to display or not.

- ui (View) (2)
    Contains all the components. Each class in the UI section is a component, that
    can be added to the virtual DOM, and only rendered when needed.

If you think about it that closer to React. We have the for each UI class, we
have an $() fonction (equivalent to the render method in react). This means
we have a virtual DOM, that we can manipulate really easily. And when the model
changes, we just render the part of the DOM that changed.

It's more complexe to write than react, because you need to specify which part
you want to render. We only use jQuery for DOM manipulation.


Storage
======

Only Model elements can be stored.
- translators:
    for each model class there is a translator that has only 2 methods
    -> map the javascript class Object to a dict that can be stored in indexedDB (called dbRecord).
    -> map a dbRecord coming from indexedDB to a javascript class Object.

    Why would you use translator instead of the object itself?
    Translator allows you to manipulate version of your store.
    If the content of the object stored in indexedDB changes (for instance you add
    a fiedl) you can update the model, then you just need to add a new translator.
    That will map this new element to your object.

    Rq: translator are also used by messager to send plain json object.

- db:
    We provide a interface (wrapper) for 2 engines: local storage and indexed db. So you can store
    same object in one or the others.

    - indexedDB:
    engine + wrapper (the engine is basically the same as the library Dexie.js)(3)
    The engine returns the plain object stored by indexedDB.
    The wrapper map the plain object to a javascript class using the corresponding translator.

    - localStorage.
    engine + wrapper.
    We also implemented a cache based on localstorage. The nice things with localStorage is
    that it's not async. So easier to use.


The 3 pages
===========

= Content scripts
    Content sripts are injected in every page you visit. That's the behaviour/ folder that contains
    all the content scripts.
    - passive one that will parse the page and identify the most interesting parts.
    - active depends on the user interaction with the page.
    (communicate with background page using
        behavior/background_clients)

= Background
    page running in the background of chrome, that will receives messages from the content sripts.
    and manipulate the informations.
    For security reasons content scripts have limited accesses. For instance they don't have
    access to database directly.
    Listens content_scripts using messaging/listener

= Lighyear
    The main UI page.

(1) we use setter and getter to allow to drasticly reduce the size of the app by
compression. We also found easier to have real class instead of function manipulating
object.

(2) ui folder could be renamed to view. It's for legacy reason we were trying to
have folders starting by different letters.

(3) dexie.js is quite new it could be interesting to use it. However our engine and wrapper,
are quite powerful and fit well our use case. Moreover because we use a common interface
for localStorage and indexedDB we can use them independently.

