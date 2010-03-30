# YOU NEED TO EDIT THESE
AUTHOR = 'Jon Robson'
AUTHOR_EMAIL = 'jdlrobson@gmail.com'
NAME = 'tiddlywebplugins.geofilters'
DESCRIPTION = 'Provides new filter near=lat,long,radius to allow queries against geo tiddlers (tiddlers with geo.long and geo.lat fields)'
VERSION = '0.92'


import os

from setuptools import setup, find_packages


# You should carefully review the below (install_requires especially).
setup(
    namespace_packages = ['tiddlywebplugins'],
    name = NAME,
    version = VERSION,
    description = DESCRIPTION,
    long_description = open(os.path.join(os.path.dirname(__file__), 'README')).read(),
    author = AUTHOR,
    author_email = AUTHOR_EMAIL,
    url = 'http://pypi.python.org/pypi/%s' % NAME,
    packages = find_packages(exclude=['test']),
    platforms = 'Posix; MacOS X; Windows',
    install_requires = ['setuptools', 'tiddlyweb','tiddlywebplugins.ltgt'],
    zip_safe = False
    )