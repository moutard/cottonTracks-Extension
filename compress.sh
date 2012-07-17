#!/bin/bash

# -- GLOBAL VARIABLES ---------------------------------------------------------
YUICOMPRESSORJAR="/usr/local/rmoutard/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar"
GOOGLE_CLOSURE_COMPILER="/usr/local/rmoutard/compiler.jar"
SOURCE_PATH='/usr/local/rmoutard/sz/'
SOURCE_NAME='SubZoom-Proto1'
DESTINATION_PATH='/usr/local/rmoutard/'
TAR_NAME='cottontracks-beta'
VERSION='0.1'

# -- PRETREATMENT -------------------------------------------------------------

echo "-------- Start Pretreatment --------"
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

# -- COMPILE ------------------------------------------------------------------
COMPILE_COMMAND="java -jar $GOOGLE_CLOSURE_COMPILER "
COMPILE_OPTIONS="--language_in=ECMASCRIPT5_STRICT"
# For each folder concatenates all the file and respects the order.
# Then compile each file.

function generateMinFile {
  # 2 Parameters
  # Array of input files
  declare -a INPUT_FILES=("${!1}")

  # Name of the output file
  OUTPUT_FILE=$2
  OUTPUT_MIN_FILE=$(echo $OUTPUT_FILE | sed 's/.js/.min.js/')

  echo "'use strict'" > $OUTPUT_FILE
  for file in ${INPUT_FILES[@]}
  do
    #echo "$file"
    # Remove the first line that correponds to 'use strict'
    sed -i -e "1d" "$file"
    cat "$file" >> $OUTPUT_FILE
    rm "$file"
  done

  $COMPILE_COMMAND $COMPILE_OPTIONS --js $OUTPUT_FILE --js_output_file $OUTPUT_MIN_FILE
  rm $OUTPUT_FILE
  echo "$OUTPUT_MIN_FILE has been generated"

}

echo "-------- Start compilation --------"
# CONFIG
config_input_files=("./config/init.js" "./config/config.js")
config_output_file="config.js"

generateMinFile config_input_files[@] $config_output_file

# DB

db_input_files=(  "./db/init.js"
                  "./db/engine.js"
                  "./db/translator.js"
                  "./db/store.js")
db_output_file="db.js"

generateMinFile db_input_files[@] $db_output_file


# MODEL
model_input_files=( "./model/init.js"
                    "./model/story.js"
                    "./model/extracted_dna.js"
                    "./model/visit_item.js")
model_output_file="model.js"

generateMinFile model_input_files[@] $model_output_file

# TRANSLATORS
translators_input_files=( "./translators/init.js"
                          "./translators/story_translators.js"
                          "./translators/visit_item_translators.js")
translators_output_file="translators.js"

generateMinFile translators_input_files[@] $translators_output_file

# UI
ui_input_files=(  "./ui/init.js"
                  "./ui/ui.js"
                  "./ui/world.js"
                  "./ui/homepage/init.js"
                  "./ui/homepage/homepage.js"
                  "./ui/homepage/favorites_grid.js"
                  "./ui/homepage/favorites_ticket.js"
                  "./ui/homepage/apps_grid.js"
                  "./ui/homepage/apps_ticket.js"
                  "./ui/homepage/grid.js"
                  "./ui/homepage/ticket.js"
                  "./ui/sticky_bar/init.js"
                  "./ui/sticky_bar/commands.js"
                  "./ui/sticky_bar/bar.js"
                  "./ui/sticky_bar/sticker.js"
                  "./ui/story/init.js"
                  "./ui/story/default_item.js"
                  "./ui/story/image_item.js"
                  "./ui/story/video_item.js"
                  "./ui.story/map_item.js"
                  "./ui/story/item.js"
                  "./ui/story/mystoryline.js"
                  "./ui/loading.js")

ui_output_file="ui.js"

generateMinFile ui_input_files[@] $ui_output_file

# -- UPDATE PATH --------------------------------------------------------------

function removePath {
  # 2 Parameters
  # Array of input files
  declare -a USELESS_FILES=("${!1}")

  # Name of the output file
  INPUT_FILE=$2

  for filename in ${USELESS_FILES[@]}
  do
    # remove ./ and escape meta characters.
    pattern=$(echo ${filename:2} | sed 's/\([[\/.*]\|\]\)/\\&/g')
    # remove line that insert correponding scripts.
    sed -i -e "/$pattern/d" "./$INPUT_FILE"
  done

  echo "Useless files have been removed from $INPUT_FILE"

}

function addPath {
  # 2 Parameters
  # Array of input files
  INCLUDE_FILE=$1

  # Correpondig Tag
  TAG=$2

  # Name of the output file
  INPUT_FILE=$3

  sed -i -e "/$TAG/a\
    <script type='text/javascript' src='$INCLUDE_FILE'></script>
    " "./$INPUT_FILE"

  echo "$INCLUDE_FILE has been added to $INPUT_FILE"

}

echo "--------- Start update path --------"
# INDEX.HTML
declare -a index_useless_files
index_useless_files=( ${config_input_files[@]}
                      ${db_input_files[@]}
                      ${model_input_files[@]}
                      ${translators_input_files[@]}
                      ${ui_input_files[@]}
                      )
removePath index_useless_files[@] "index.html"

addPath "config.min.js" "Cotton.config" "index.html"
addPath "db.min.js" "Cotton.db" "index.html"
addPath "model.min.js" "Cotton.model" "index.html"
addPath "translators.min.js" "Cotton.translators" "index.html"
addPath "ui.min.js" "Cotton.ui" "index.html"

# BACKGROUNG.HTML
declare -a background_useless_files
background_useless_files=( ${config_input_files[@]}
                      ${db_input_files[@]}
                      ${model_input_files[@]}
                      ${translators_input_files[@]}
                      )
removePath background_useless_files[@] "background.html"

addPath "config.min.js" "Cotton.config" "background.html"
addPath "db.min.js" "Cotton.db" "background.html"
addPath "model.min.js" "Cotton.model" "background.html"
addPath "translators.min.js" "Cotton.translators" "background.html"
addPath "ui.min.js" "Cotton.ui" "background.html"

# WORKER.JS
function addWorkerPath {
  # 2 Parameters
  # Array of input files
  INCLUDE_FILE=$1

  # Correpondig Tag
  TAG=$2

  # Name of the output file
  INPUT_FILE=$3

  sed -i -e "/$TAG/a\
    importScripts('../$INCLUDE_FILE');
    " "./$INPUT_FILE"

  echo "$INCLUDE_FILE has been added to $INPUT_FILE"

}

declare -a worker_useless_files
worker_useless_files=( ${config_input_files[@]})
removePath worker_useless_files[@] "./algo/worker.js"


addWorkerPath "config.min.js" "Cotton.config" "./algo/worker.js"

# MANIFEST
declare -a manifest_useless_files
manifest_useless_files=( ${model_input_files[@]})
removePath manifest_useless_files[@] "./manifest.json"

sed -i -e "16 a\
  \"model.min.js\",
  " "./manifest.json"


