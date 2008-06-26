
"""
Test turning a bag into other forms.
"""

import sys
sys.path.append('.')

import simplejson

from tiddlyweb.serializer import Serializer
from tiddlyweb.bag import Bag

from fixtures import bagfour

expected_string = """TiddlerOne
TiddlerTwo
TiddlerThree"""

expected_revbag_string = """TiddlerOne:None
TiddlerTwo:None
TiddlerThree:None"""

expected_html_string = """<ul>
<li><a href="/bags/bagfour/tiddlers/TiddlerOne">TiddlerOne</a></li>
<li><a href="/bags/bagfour/tiddlers/TiddlerTwo">TiddlerTwo</a></li>
<li><a href="/bags/bagfour/tiddlers/TiddlerThree">TiddlerThree</a></li>
</ul>"""

expected_html_revbag_string = """<ul>
<li><a href="/bags/bagfour/tiddlers/TiddlerOne/revisions/None">TiddlerOne:None</a></li>
<li><a href="/bags/bagfour/tiddlers/TiddlerTwo/revisions/None">TiddlerTwo:None</a></li>
<li><a href="/bags/bagfour/tiddlers/TiddlerThree/revisions/None">TiddlerThree:None</a></li>
</ul>"""

def setup_module(module):
    module.serializer = Serializer('text')

def test_generate_json():
    serializer = Serializer('json')
    serializer.object = bagfour
    string = serializer.to_string()

    json = simplejson.loads(string)
    assert json['policy']['manage'] == ['NONE']


def test_generated_string():
    string = serializer.list_tiddlers(bagfour)

    assert string == expected_string

def test_generated_string_with_revbag():
    bagfour.revbag = True
    string = serializer.list_tiddlers(bagfour)

    assert string == expected_revbag_string
    bagfour.revbag = False

def test_generated_html():
    html_serializer = Serializer('html')
    string = html_serializer.list_tiddlers(bagfour)

    assert expected_html_string in string

def test_generated_wiki():
    wiki_serializer = Serializer('wiki')
    # work around a limitation in the serializations
    # when store is not set, we assume the bag has not been reified
    string = wiki_serializer.list_tiddlers(bagfour)

    assert '<div title="TiddlerOne' in string
    assert '<div title="TiddlerTwo' in string
    assert '<div title="TiddlerThree' in string

def test_generated_html_with_revbag():
    html_serializer = Serializer('html')
    bagfour.revbag = True
    string = html_serializer.list_tiddlers(bagfour)

    assert expected_html_revbag_string in string
    bagfour.revbag = False

def test_json_to_bag():
    serializer = Serializer('json')

    json_string = simplejson.dumps(dict(policy=dict(read=['user1'])))
    newbag = Bag('bagho')
    serializer.object = newbag
    serializer.from_string(json_string)

    assert newbag.name == 'bagho'
    assert newbag.policy.read == ['user1']
    assert newbag.policy.manage == ['NONE']

