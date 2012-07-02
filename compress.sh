#!/bin/bash

YUICOMPRESSORJAR="/Users/rmoutard/src/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar"

SOURCE_PATH='/Users/rmoutard/src/subzoom'
DESTINATION_PATH='/Users/rmoutard/Downloads/'
TAR_NAME='cottontracks-beta'
VERSION='0.1'

mkdir $DESTINATION_PATH$TAR_NAME$VERSION

cp -r $SOURCE_PATH $DESTINATION_PATH$TAR_NAME$VERSION

cd $DESTINATION_PATH$TAR_NAME$VERSION

# Find all the .js file

find . -type d \( -name singletons -o -name lib ) -prune -o -name '*.js' -type f | while read file; do
    # Compress each file
    minfile=$(echo $file | sed 's/.js/.min.js/')
    # cp $minfile $DESTINATION_PATH$TAR_NAME$VERSION$minfile
    java -jar $YUICOMPRESSORJAR $file -o $minfile --charset utf-8
done