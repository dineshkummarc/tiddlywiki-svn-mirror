"""
A class and other thingies for a Tiddler.
"""

from datetime import datetime

def current_timestring():
    dt = datetime.utcnow()
    return unicode(dt.strftime('%Y%m%d%H%M'))

class Tiddler(object):
    """
    A proper tiddler has the follow attributes:
    title: the name of the tiddler
    modifier: the name of the thing that edited the tiddler
    modified: the last time it was edited
    created: the time it was created
    tags: the list of tags this tiddler has.

    created is going to take some diddling to get 
    right. So we ignore it for now.

    """


    def __init__(self,
            title=None,
            modified=current_timestring(),
            created='',
            modifier=None,
            tags=[],
            bag=None,
            revision=None,
            text=None):
        self.title = title
        self.modifier = modifier
        self.modified = modified
        self.created = created
        self.tags = tags
        self.bag = bag
        self.text = text
        self.revision = revision
        # reference to the store which 'got' us
        # this is can be used in serialization
        self.store = None

    def __repr__(self):
        """
        Include the name of the tiddler in the repr.
        This is nice for debugging.
        """
        return self.title + object.__repr__(self)

