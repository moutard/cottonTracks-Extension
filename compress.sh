#!/bin/bash

# -- GLOBAL VARIABLES --
YUICOMPRESSORJAR="/usr/local/rmoutard/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar"
GOOGLE_CLOSURE_COMPILER="/usr/local/rmoutard/compiler.jar"
SOURCE_PATH='/usr/local/rmoutard/sz/'
SOURCE_NAME='SubZoom-Proto1'
DESTINATION_PATH='/usr/local/rmoutard/'
TAR_NAME='cottontracks-beta'
VERSION='0.1'

# -- PRETREATMENT --
# Copy the folder to avoid bad surprise
cp -r $SOURCE_PATH$SOURCE_NAME $DESTINATION_PATH
mv $DESTINATION_PATH$SOURCE_NAME $DESTINATION_PATH$TAR_NAME$VERSION
echo 'Source folder has been copied'

# Go to the copy folder
cd $DESTINATION_PATH$TAR_NAME$VERSION

# Remove useless folder
#rm -rf .git
#rm .gitignore
rm -rf test
echo 'Useless folders have been removed'

# -- COMPILE --
COMPILE_COMMAND="java -jar $GOOGLE_CLOSURE_COMPILER "
COMPILE_OPTIONS="--language_in=ECMASCRIPT5_STRICT"
# For each folder concatenates all the file and respects the order.
# Then compile each file.

function generateMinFile {
  # 3 Parameters
  # Array of input files
  declare -a INPUT_FILES=("${!1}")

  # Name of the output file
  OUTPUT_FILE=$2
  OUTPUT_MIN_FILE=$(echo $OUTPUT_FILE | sed 's/.js/.min.js/')

  echo "'use strict'" > $OUTPUT_FILE
  for file in ${INPUT_FILES[@]}
  do
    echo "$file"
    # Remove the first line that correponds to 'use strict'
    sed -i -e "1d" "$file"
    cat "$file" >> $OUTPUT_FILE
    # rm "$file"
  done

  $COMPILE_COMMAND $COMPILE_OPTIONS --js $OUTPUT_FILE --js_output_file $OUTPUT_MIN_FILE
  # rm $OUTPUT_FILE
  echo "$OUTPUT_MIN_FILE has been generated"

}


# CONFIG
local config_input_files=("./config/init.js" "./config/config.js")
config_output_file="config.js"

generateMinFile config_input_files[@] $config_output_file

# DB

local db_input_files=("./db/init.js" "./db/engine.js" "./db/translator.js" "./db/store.js")
db_output_file="db.js"

generateMinFile db_input_files[@] $db_output_file


# MODEL
local model_input_files=("./model/init.js" "./model/story.js" "./model/extracted_dna.js" "./model/visit_item.js")
model_output_file="model.js"

generateMinFile model_input_files[@] $model_output_file

# TRANSLATORS
local translators_input_files=( "./translators/init.js"
                                "./translators/story_translator.js"
                                "./translators/visit_item_translators.js")
translators_output_file="translators.js"

generateMinFile translators_input_files[@] $translators_output_file


