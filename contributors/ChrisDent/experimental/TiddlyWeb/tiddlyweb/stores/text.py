"""
Simple functios for storing bags as textfile
on the filesystem.
"""

# get from config!
store_root = 'store'

import os

from tiddlyweb.serializer import Serializer

def recipe_put(recipe):
    recipe_path = _recipe_path(recipe)

    recipe_file = file(recipe_path, 'w')

    serializer = Serializer(recipe, 'text')

    recipe_file.write(serializer.to_string())

    recipe_file.close()

def recipe_get(recipe):
    recipe_path = _recipe_path(recipe)

    print recipe_path
    recipe_file = file(recipe_path, 'r')

    serializer = Serializer(recipe, 'text')

    recipe_string = recipe_file.read()

    recipe_file.close()

    return serializer.from_string(recipe_string)

def _recipe_path(recipe):
    return os.path.join(store_root, 'recipes', recipe.name)

def bag_put(bag):

    bag_path = _bag_path(bag.name)
    tiddlers_dir = _tiddlers_dir(bag.name)

    if not os.path.exists(bag_path):
        os.mkdir(bag_path)

    if not os.path.exists(tiddlers_dir):
        os.mkdir(tiddlers_dir)

    _write_security_policy(bag, bag_path)

def bag_get(bag):
    pass

def _bag_path(bag_name):
    return os.path.join(store_root, 'bags', bag_name)

def _tiddlers_dir(bag_name):
    return os.path.join(_bag_path(bag_name), 'tiddlers')

def _write_security_policy(bag, bag_path):
    security_filename = os.path.join(bag_path, 'security_policy')
    security_file = file(security_filename, 'w')
    security_file.write(bag.policy)
    security_file.close()

def tiddler_put(tiddler):
    """
    Write a tiddler into the store. We only write if
    the bag already exists. Bag creation is a 
    separate action from writing to a bag.
    """

    # should be get a Bag or a name here?
    bag_name = tiddler.bag

    store_dir = _tiddlers_dir(bag_name)

    tiddler_filename = os.path.join(store_dir, tiddler.title)
    tiddler_file = file(tiddler_filename, 'w')

    serializer = Serializer(tiddler, 'text')

    tiddler_file.write(serializer.to_string())

    tiddler_file.close()

def tiddler_get(tiddler):
    """
    Get a tiddler as string from a bag and deserialize it into 
    text.
    """

    bag_name = tiddler.bag

    store_dir = _tiddlers_dir(bag_name)

    tiddler_filename = os.path.join(store_dir, tiddler.title)
    tiddler_file = file(tiddler_filename, 'r')

    serializer = Serializer(tiddler, 'text')

    tiddler_string = tiddler_file.read()

    tiddler_file.close()

    return serializer.from_string(tiddler_string)
