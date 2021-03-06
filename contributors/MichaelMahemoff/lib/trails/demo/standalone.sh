#!/bin/bash
./faketrail.py templates/trail-player.html index.html
# packagedir=/tmp/standalone-$$/trail
packagedir=standalone-dist/trail
if [ -d $packagedir ] ; then mv $packagedir /tmp/standalone-$$ ; fi
mkdir -p $packagedir
mkdir -p $packagedir/static/js $packagedir/static/css $packagedir/static/images
# if [ "$?" != "0" ] ; then echo "can't create $packagedir" ; exit 1 ; fi
# http://www.linuxquestions.org/questions/linux-newbie-8/how-to-do-recursive-file-copy-of-directory-for-specific-files-199134/
files="index.html static/js/jquery-1.3.2.js static/js/jquery.modal.js static/js/jquery.iframe.js static/js/trailPlayer.js static/js/jquery.supersleight.js static/css/trails.css static/images/*"
# tar cf - $files | (cd $packagedir; tar xf -)
rsync -Rv $files $packagedir
echo "wrote to $packagedir/index.html"
