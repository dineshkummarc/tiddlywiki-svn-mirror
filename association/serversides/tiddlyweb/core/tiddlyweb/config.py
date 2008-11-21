"""
The System's Configuration, to be carried
around in the environ as 'tiddlyweb.config'.

If there is a tiddlywebconfig.py
file in the working directory where twanager or the
server is started, its values will override the defaults
in this file.

The server administrator may add additional keys
to the config if they are useful in extensions.

What follows are descriptions of the known keys.

system_plugins -- A list of Python module names that
act as plugins for the running server. At server startup
time they are found, compiled, and the function init(config)
is called on them, with a reference to the current config
passed in. Use this to add functionality to the server
that cannot be accomplised from the server, such as
adding additional web handlers.

twanager_plugins -- A list of Python module names that
act as plugins for twanager, adding command line functionality.
As with system_plugins init(config) is called.

server_store -- The name of a module implementing 
tiddlyweb.stores.StorageInterface. First the module name
is looked up in the tiddlyweb.stores package space, if
it is not found there, sys.path is searched. Following the
name of the module is an arbitrary dictionary of configuration
information that is passed to the store. This could, for
example, include databse username and password information.

server_request_filters -- A list of WSGI applications 
which, in order, process the incoming requests made to the
server. This can extract, add, or filter information as 
necessary.

server_response_filters -- A list of WSGI applications
which, in order, process the outgoing response from the 
server. This can transform, log, or handle exceptions as
necessary.

server_host -- The hostname of this server, usually set
from whatever starts the server.

server_prefix -- A URL path portion which is a prefix to
every URL the system uses and produces. Use this to host
TiddlyWeb in a subdirectory. Default is ''.

extension_types -- A dictionary that pairs extension
strings used in URLs as human controlled content-negotiation
with the MIME types they represent. Add to this if you 
add to serializers.

serializers -- Incoming request Accept headers, or extension
MIME types paired with a tiddlyweb.serializations.Serializer
implementation and an outgoing MIME type for that type of 
serialization.

extractors -- A extractor is a credential extractor (see
tiddlyweb.web.extractors.ExtractorInterface) that looks in
an incoming request to attempt to extract information from
it that indicates a potential user in the system. This 
config item is an ordered list of extractors, tried in 
succession until one returns tiddlyweb.usersign information
or there are no more left.

auth_systems -- A list of challengers available to the 
system when it needs to ask for a user. (See
tiddlyweb.web.challengers.ChallengerInterface) If there
is more than one challenger the user is presented with a
list of those available. If there is only one, the user
is automatically directed to just that one. A challenger
needs to work with the extractors system so that the 
challenger puts something in future requests that the 
extractor can extract.

secret -- A string used to encrypt the cookie installed by
some of the challengers and used by the cookie extractor.
NOTE: EVERY INSTALLATION SHOULD CHANGE THIS IN ITS OWN
CONFIGURATION.

base_tiddlywiki -- the file location of the tiddlywiki
file into which Tiddlers are pushed when creating
outgoing TiddlyWiki representations from TiddlyWeb. This
can be an absolute path or relative to the startup 
directory of the server.

urls_map -- the file location of the text file that maps
URL paths to python code, doing method dispatch. With
the advent of system_plugins, it is not often necessary
to change this.

bag_create_policy -- A policy statement on who or what
kind of user can create new bags on the system through the
web API. ANY means any authenticated user can. ADMIN means 
any user with role ADMIN can. '' means anyone can.

recipe_create_policy -- A policy statement on who or what kind
of user can create new recipes on the system through the web
API. See bag_create_policy.
"""

import os

try:
    from pkg_resources import resource_filename
    base_tiddlywiki = resource_filename('tiddlyweb', 'empty.html')
    urls_map = resource_filename('tiddlyweb', 'urls.map')
except ImportError:
    base_tiddlywiki = 'tiddlyweb/empty.html'
    urls_map = 'tiddlyweb/urls.map'

# The server filters (the WSGI MiddleWare)
from tiddlyweb.web.negotiate import Negotiate
from tiddlyweb.web.query import Query
from tiddlyweb.web.extractor import UserExtract
from tiddlyweb.web.http import HTTPExceptor
from tiddlyweb.web.wsgi import StoreSet, EncodeUTF8, SimpleLog, HTMLPresenter, PermissionsExceptor


# A dict containing the configuration of TiddlyWeb, both 
# as a server and as a library. This dictionary can contain
# anything. If there is a file called tiddlywebconfig.py in
# the startup working directory of twanager or other tiddlyweb
# using code, its contents will be merged with these defaults.
DEFAULT_CONFIG = {
        'system_plugins': [],
        'twanager_plugins': ['tiddlyweb.fromsvn', 'tiddlyweb.instancer'],
        'server_store': ['text', {'store_root': 'store'}],
        'server_request_filters': [
            Query,
            StoreSet,
            UserExtract,
            Negotiate
            ],
        'server_response_filters': [
            HTMLPresenter,
            PermissionsExceptor,
            HTTPExceptor,
            EncodeUTF8,
            SimpleLog
            ],
        'server_host': {},
        'server_prefix': '',
        'extension_types': {
            'txt': 'text/plain',
            'html': 'text/html',
            'json': 'application/json',
            'wiki': 'text/x-tiddlywiki',
        },
        'serializers': {
            'text/x-tiddlywiki': ['wiki', 'text/html; charset=UTF-8'],
            'text/html': ['html', 'text/html; charset=UTF-8'],
            'text/plain': ['text', 'text/plain; charset=UTF-8'],
            'application/json': ['json', 'application/json; charset=UTF-8'],
            'default': ['html', 'text/html; charset=UTF-8'],
        },
        'extractors': [
            'http_basic',
            'simple_cookie',
            ],
        'auth_systems': [
            'cookie_form',
            'openid',
            ],
        # XXX this should come from a file
        'secret': 'this should come from a file',
        # XXX this should allow a URL, but not doing that
        # yet because of google app engine
        'base_tiddlywiki': base_tiddlywiki,
        'urls_map': urls_map,
        'bag_create_policy': '', # ANY (authenticated user) or ADMIN (role) or '' (all can create)
        'recipe_create_policy': '', # ANY or ADMIN or ''
        }


def read_config():
    """
    Read in a local configuration override, called
    tiddlywebconfig.py, from the current working directory.
    If the file can't be imported an exception will be
    thrown, preventing unexpected results.

    What's expected in the override file is a dict with the
    name config.
    """
    from tiddlywebconfig import config as custom_config
    global config
    config = DEFAULT_CONFIG
    for key in custom_config:
        try:
            # If this config item is a dict, update to update it
            # XXX: using exceptions for conditionals, a bit squiffy?
            custom_config[key].keys()
            config[key].update(custom_config[key])
        except AttributeError:
            config[key] = custom_config[key]

if os.path.exists('tiddlywebconfig.py'):
    read_config()
else:
    config = DEFAULT_CONFIG
