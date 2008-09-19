"""
Given a string or file representing a wiki, do the
work to import it into a named bag.
"""

import codecs
import re

from BeautifulSoup import BeautifulSoup

from tiddlyweb.tiddler import Tiddler

def import_wiki_file(store, filename='wiki', bagname='wiki'):
    f = codecs.open(filename, encoding='utf-8', errors='replace')
    wikitext = f.read()
    f.close()
    return import_wiki(store, wikitext, bagname)

def import_wiki(store, wikitext, bagname='wiki'):
    soup = BeautifulSoup(wikitext)
    store_area = soup.find('div', id='storeArea')
    divs = store_area.findAll('div')

    for tiddler in divs:
        _do_tiddler(bagname, tiddler, store)

def _do_tiddler(bagname, tiddler, store):
    new_tiddler = Tiddler(tiddler['title'], bag=bagname)

    try:
    	new_tiddler.text = _html_decode(tiddler.find('pre').contents[0])
    except IndexError:
        # there are no contents in the tiddler
        new_tiddler.text = ''

    for attr, value in tiddler.attrs:
        data = tiddler.get(attr, None)
        if data and attr != 'tags':
            if attr in (['modifier', 'created', 'modified']):
                new_tiddler.__setattr__(attr, data)
            else:
                new_tiddler.fields[attr] = data
    new_tiddler.tags = _tag_string_to_list(tiddler.get('tags', ''))

    try:
    	store.put(new_tiddler)
    except OSError, e:
        # This tiddler has a name that we can't yet write to the
        # store. For now we just state the error and carry on.
        import sys
        print >> sys.stderr, 'Unable to write %s: %s' % (new_tiddler.title, e)

def _tag_string_to_list(string):
    tags = []
    tag_matcher = re.compile(r'([^ \]\[]+)|(?:\[\[([^\]]+)\]\])')
    for match in tag_matcher.finditer(string):
        if match.group(2):
            tags.append(match.group(2))
        elif match.group(1):
            tags.append(match.group(1))

    return tags

def _html_decode(text):
    return text.replace('&gt;', '>').replace('&lt;', '<').replace('&amp;', '&').replace('&quot;', '"')

