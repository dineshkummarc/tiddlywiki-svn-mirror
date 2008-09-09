"""
retrieve TiddlyWiki plugins from authors' repositories
"""

import sys
import os
import shutil

from urllib import urlopen
from tiddlyweb.config import config
from tiddlyweb.store import Store
from tiddlyweb.bag import Bag
from tiddlyweb.recipe import Recipe
from tiddlyweb.importer import import_wiki
from tiddlywiki import TiddlyWiki
from dirScraper import DirScraper

def main(args):
	env = { "tiddlyweb.config": config }
	store = Store("text", env)
	repos = getRepositories("repos.lst")
	for repo in repos:
		print "processing %s (%s)" % (repo["name"], repo["URI"]) # XXX: log
		getPlugins(repo, store)
	bags = [repo["name"] for repo in repos] # XXX: repo["name"] not necessarily equals Bag(repo["name"]).name
	generateRecipe(bags, store)

def getRepositories(filepath):
	"""
	retrieve list of repositories from file

	file structure:
	* one repository per line
	* three components per line (pipe-delimited):
	  URI | type | name

	@param filepath: full path to source file
	@return: repository objects
	@rtype : list
	"""
	repos = []
	for line in open(filepath, "r"):
		if line.strip() and not line.startswith("#"): # skip blank and commented lines
			repo = {}
			components = line.split("|", 2)
			repo["URI"] = components[0].strip()
			repo["type"] = components[1].strip()
			repo["name"] = components[2].strip()
			repos.append(repo)
	return repos

def getPlugins(repo, store):
	"""
	retrieve and store plugins from repository

	@param repo (list): repository dictionaries
	@param store (Store): TiddlyWeb store
	@return (bool): success
	"""
	if repo["type"] == "TiddlyWiki":
		try:
			html = urlopen(repo["URI"]).read() # TODO: deferred processing?!
		except IOError:
			return False # TODO: log error
		bag = Bag(repo["name"])
		tw = TiddlyWiki(html)
		tw.convertStoreFormat()
		plugins = tw.getPluginTiddlers(repo);
		empty = "<html><body><div id='storeArea'>\n</div></body></html>" # XXX: ugly hack; cf. tiddlywiki.TiddlyWiki.getPluginTiddlers()
		if plugins != empty:
			savePlugins(store, bag)
			import_wiki(store, plugins, bag.name)
			return True
		else:
			return False # TODO: log error
	elif repo["type"] == "SVN":
		bag = Bag(repo["name"])
		svn = DirScraper(repo["URI"])
		plugins = svn.getPlugins("./", True)
		if plugins:
			savePlugins(store, bag)
			for plugin in plugins:
				plugin.bag = bag.name
				store.put(plugin)
			return True
		else:
			return False # TODO: log error
	else:
		pass # XXX: TBD

def generateRecipe(bags, store):
	"""
	generate recipe from a list of bags

	@param bags (list): bag names
	@param store (Store): TiddlyWeb store
	@return: None
	"""
	recipe = Recipe("plugins")
	items = [([bag, ""]) for bag in bags] # TODO: use None instead of empty string?
	recipe.set_recipe(items)
	store.put(recipe)

def savePlugins(store, bag):
	"""
	save repository's plugins to store

	@param bags (Bag): TiddlyWeb bag
	@param store (Store): TiddlyWeb store
	@return: None
	"""
	try: # XXX: don't use exception here!?
		store.delete(bag) # XXX: ugly hack?
	except IOError:
		pass
	store.put(bag)

# startup

if __name__ == "__main__": # skip main() if imported as module
	sys.exit(main(sys.argv))

