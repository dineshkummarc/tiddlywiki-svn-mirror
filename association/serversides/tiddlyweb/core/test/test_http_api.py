"""
Run through the entire API to expound,
expand, explain, etc.

Read the TESTS variable as document of
the capabilities of the API.

If you run this test file by itself, instead
of as a test it will produce a list of test
requests and some associated information.
"""

import sys
import os
sys.path.append('.')

from wsgi_intercept import httplib2_intercept
import wsgi_intercept
import httplib2
import simplejson

from base64 import b64encode
from re import match

from fixtures import muchdata, reset_textstore, teststore

from tiddlyweb.model.user import User

authorization = b64encode('cdent:cowpig')
base_url = 'http://our_test_domain:8001'

def setup_module(module):
    from tiddlyweb.web import serve
    def app_fn():
        return serve.load_app('our_test_domain', 8001, 'tiddlyweb/urls.map')
    httplib2_intercept.install()
    wsgi_intercept.add_wsgi_intercept('our_test_domain', 8001, app_fn)

    module.store = teststore()
    reset_textstore()
    muchdata(module.store)

    # we're going to need a user for testing auth stuff
    # so make that now
    user = User('cdent')
    user.set_password('cowpig')
    module.store.put(user)

    module.http = httplib2.Http()

def test_assert_response():
    """
    Make sure our assertion tester is valid.
    """
    response = {
            'status': '200',
            'location': 'http://example.com',
            }
    content = 'Hello World\n'
    status = '200'
    headers = {
            'location': 'http://example.com',
            }
    expected = ['Hello']

    assert_response(response, content, status, headers, expected)

EMPTY_TEST = {
        'name': '',
        'desc': '',
        'method': 'GET',
        'url': '',
        'status': '200',
        'request_headers': {},
        'response_headers': {},
        'expected': [],
        'data': '',
        }
TESTS = [
        { ##########
            'name': 'Get Root Page',
            'desc': 'Get and display the root page',
            'url': '/',
            'response_headers': {
                'content-type': 'text/html; charset=UTF-8',
                },
            'expected': ['bags', 'recipes'],
            },
        { ##########
            'name': 'Authenticated Root Page',
            'desc': 'Pass in auth info when getting root page',
            'url': '/',
            'request_headers': {
                'Authorization': 'Basic %s' % authorization,
                'User-Agent': 'Mozilla/5',
                },
            'expected': ['bags', 'recipes', 'User cdent'],
            },
        { ##########
            'name': 'List of recipes',
            'desc': 'Get the list of all readable recipes',
            'url': '/recipes',
            'expected': ['id="recipes"', 'long'],
            },
        ]

def test_the_TESTS():
    """
    Run the entire TEST.
    """
    for test_data in TESTS:
        test = dict(EMPTY_TEST)
        test.update(test_data)
        full_url = base_url + test['url']
        if test['method'] == 'GET' or test['method'] == 'DELETE':
            response, content = http.request(full_url, method=test['method'], headers=test['request_headers'])
        else:
            response, content = http.request(full_url, method=test['method'], headers=test['request_headers'],
                    body=data)
        assert_response(response, content, test['status'], headers=test['response_headers'], expected=test['expected'])


def assert_response(response, content, status, headers=None, expected=None):
    assert response['status'] == status

    if headers:
        for header in headers:
            assert response[header] == headers[header]

    if expected:
        for expect in expected:
            assert expect in content

if __name__ == '__main__':
    for test_data in TESTS:
        test = dict(EMPTY_TEST)
        test.update(test_data)
        full_url = base_url + test['url']
        print "testing: %s" % test['name']
        print test['desc']
        print '%s %s' % (test['method'], full_url)
        print
