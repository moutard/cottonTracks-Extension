#!/bin/bash

# -- GLOBAL VARIABLES ---------------------------------------------------------
GOOGLE_CLOSURE_COMPILER='/usr/local/rmoutard/compiler.jar'
SOURCE_PATH='/usr/local/rmoutard/sz/'
SOURCE_NAME='SubZoom-Proto1'
DESTINATION_PATH='/usr/local/rmoutard/'
TAR_NAME='cottontracks-beta'
VERSION='0.1'


# -- PRETREATMENT -------------------------------------------------------------

echo '-------- Start Pretreatment --------'
rm -rf $DESTINATION_PATH$TAR_NAME$VERSION
rm -rf "$DESTINATION_PATH$TAR_NAME$VERSION.pem"
# Copy the folder to avoid bad surprise
cp -r $SOURCE_PATH$SOURCE_NAME $DESTINATION_PATH$TAR_NAME$VERSION
#mv $DESTINATION_PATH$SOURCE_NAME $DESTINATION_PATH$TAR_NAME$VERSION
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
COMPILE_OPTIONS="$COMPILE_OPTIONS --compilation_level ADVANCED_OPTIMIZATIONS"
COMPILE_OPTIONS="$COMPILE_OPTIONS --jscomp_off=globalThis"
COMPILE_OPTIONS="$COMPILE_OPTIONS --warning_level DEFAULT"
# For each folder concatenates all the file and respects the order.
# Then compile each file.

function generateMultipleMinFile {
  # Use google closure compiler with many files, using --js flag.
  # 2 Parameters
  # Array of input files
  declare -a INPUT_FILES=("${!1}")

  # Name of the output file
  OUTPUT_FILE=$2
  OUTPUT_MIN_FILE=$(echo $OUTPUT_FILE | sed 's/.js/.min.js/')

  INPUT_LIST=""
  for file in ${INPUT_FILES[@]}
  do
    INPUT_LIST="$INPUT_LIST --js $file"
  done

  EXTERNS="--externs ./lib/jquery-1.3.2.externs.js --externs ./lib/backbone-0.9.2.externs.js --externs ./lib/underscore-1.3.3.externs.js --externs ./lib/class.externs.js --externs ./lib/w3c_indexeddb.externs.js --externs ./lib/chrome_extensions.externs.js --externs ./lib/parse_url.externs.js --externs ./lib/html5.externs.js"
  $COMPILE_COMMAND $COMPILE_OPTIONS $INPUT_LIST --js_output_file $OUTPUT_MIN_FILE $EXTERNS
  echo "$OUTPUT_MIN_FILE has been generated"

}

function generateMultipleMinFileWithExtern {
  # Use google closure compiler with many files, using --js flag.
  # 2 Parameters
  # Array of input files
  declare -a INPUT_FILES=("${!1}")

  # Array of externs file (like library)
  declare -a EXTERNS_FILES=("${!2}")

  # Name of the output file
  OUTPUT_FILE=$3
  OUTPUT_MIN_FILE=$(echo $OUTPUT_FILE | sed 's/.js/.min.js/')

  INPUT_LIST=""
  for file in ${INPUT_FILES[@]}
  do
    INPUT_LIST="$INPUT_LIST --js $file"
  done

  EXTERNS_LIST=""
  for file in ${EXTERNS_FILES[@]}
  do
    EXTERNS_LIST="$EXTERNS_LIST --externs $file"
  done


  $COMPILE_COMMAND $COMPILE_OPTIONS $INPUT_LIST $EXTERNS_LIST_CMD --js_output_file $OUTPUT_MIN_FILE
  echo "$OUTPUT_MIN_FILE has been generated"

}

# COTTON
# A Set of vectors that corresponds to a grouped by category.

cotton_input_files=('./init.js')

# CONFIG
config_input_files=('./config/init.js'
                    './config/config.js')
config_output_file='config.js'

# DB
db_input_files=(  './db/init.js'
                  './db/engine.js'
                  './db/translator.js'
                  './db/store.js')
db_output_file='db.js'

# MODEL
model_input_files=( './model/init.js'
                    './model/story.js'
                    './model/extracted_dna.js'
                    './model/visit_item.js'
                    './model/tool.js'
             	  )
model_output_file="model.js"

# UTILS
utils_input_files=( './utils/init.js'
                    './utils/ga.js'
                    './utils/tools_container.js'
                    './utils/exclude_container.js'
                    )
utils_output_file="utils.js"

# TRANSLATORS
translators_input_files=( './translators/init.js'
                          './translators/story_translators.js'
                          './translators/visit_item_translators.js')
translators_output_file='translators.js'

# UI
ui_input_files=(  './ui/init.js'
                  './ui/ui.js'
                  './ui/world.js'
                  './ui/homepage/init.js'
                  './ui/homepage/homepage.js'
                  './ui/homepage/favorites_grid.js'
                  './ui/homepage/favorites_ticket.js'
                  './ui/homepage/apps_grid.js'
                  './ui/homepage/apps_ticket.js'
                  './ui/homepage/grid.js'
                  './ui/homepage/ticket.js'
                  './ui/sticky_bar/init.js'
                  './ui/sticky_bar/commands.js'
                  './ui/sticky_bar/bar.js'
                  './ui/sticky_bar/sticker.js'
                  './ui/story/init.js'
                  './ui/story/default_item.js'
                  './ui/story/search_item.js'
                  './ui/story/image_item.js'
                  './ui/story/video_item.js'
                  './ui/story/map_item.js'
                  './ui/story/slideshow_item.js'
                  './ui/story/item.js'
                  './ui/story/mystoryline.js'
                  './ui/loading.js')
ui_output_file='ui.js'

# BEHAVIOR
behavior_input_files=( './behavior/init.js'
                       './behavior/passive/init.js'
                       './behavior/passive/db_sync.js'
                       './behavior/passive/parser.js'
                       './behavior/passive/google_parser.js'
                       './behavior/active/init.js'
                       './behavior/active/reading_rater.js'
                       './behavior/active/reading_rater/score.js'
                       )
behavior_output_file='behavior.js'

# -- COMPILE & UPDATE PATH ----------------------------------------------------

function removePath {
  # 2 Parameters
  # Array of input files
  declare -a USELESS_FILES=("${!1}")

  # Name of the output file
  INPUT_FILE=$2

  for filename in ${USELESS_FILES[@]}
  do
    # remove ./ and escape meta characters.
    #pattern=$(echo ${filename:2} | sed 's/\([[\/.*]\|\]\)/\\&/g')
    pattern=$(echo ${filename:2} | sed 's/[\/&]/\\&/g')
    #echo "$pattern"
    # remove line that insert correponding scripts.
    sed -i '' -e "/$pattern/d" "./$INPUT_FILE"
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

  sed -i '' -e "/$TAG/a\\
    <script type='text/javascript' src='$INCLUDE_FILE'></script>
    " "./$INPUT_FILE"

  echo "$INCLUDE_FILE has been added to $INPUT_FILE"

}

echo "--------- Start update path --------"
# -- INDEX.HTML ---------------------------------------------------------------
# Indicate here all the files you need to include in index.html. You can use
# predifine set of vector, and complete it with missing_files vector.
# files that are not in predifined vector set.
declare -a index_lib
index_lib=( './lib/date.format.js'
            './lib/parse_url.js')


index_missing_files=( './db/expand_store.js'
                      './db/populate_db.js'
                      './algo/init.js'
                      './algo/common/init.js'
                      './algo/common/cluster_story.js'
                      './controller/controller.js'
                      )

declare -a index_includes_files
index_includes_files=(
                      ${cotton_input_files[@]}
                      ${config_input_files[@]}
                      ${utils_input_files[@]}
                      ${db_input_files[@]}
                      ${model_input_files[@]}
                      ${translators_input_files[@]}
                      ${ui_input_files[@]}
                      ${index_missing_files[@]}
                      )

generateMultipleMinFile index_includes_files[@] "index.js"

#generateMultipleMinFileWithExtern index_includes_files[@] index_lib[@] "index.js"

#removePath  array_of_files_name  file
removePath index_includes_files[@] "index.html"
#addPath file_to_add   after_this_tag  in_the_file
addPath 'index.min.js' 'Cotton.config' 'index.html'

# -- BACKGROUNG.HTML ----------------------------------------------------------
declare -a background_lib
background_lib=( './lib/date.format.js'
                 './lib/parse_url.js')

background_missing_files=( './messaging/content_script_listener.js'
                         )

declare -a background_includes_files
background_includes_files=( ${background_lib[@]}
                            ${cotton_input_files[@]}
                            ${config_input_files[@]}
                            ${utils_input_files[@]}
                            ${db_input_files[@]}
                            ${model_input_files[@]}
                            ${translators_input_files[@]}
                            ${background_missing_files[@]}
                          )

generateMultipleMinFile background_includes_files[@] 'background.js'

removePath background_includes_files[@] 'background.html'

addPath 'background.min.js' 'Cotton.config' 'background.html'

# -- WORKER.JS ----------------------------------------------------------------
function addWorkerPath {
  # 2 Parameters
  # Array of input files
  INCLUDE_FILE=$1

  # Correpondig Tag
  TAG=$2

  # Name of the output file
  INPUT_FILE=$3

  sed -i '' -e "/$TAG/a\\
    importScripts("../../$INCLUDE_FILE");
    " "./$INPUT_FILE"

  echo "$INCLUDE_FILE has been added to $INPUT_FILE"

}

declare -a worker_lib
worker_lib=( './lib/parse_url.js')

worker_missing_files=( './algo/init.js'
                       './algo/dbscan1/init.js'
                       './algo/dbscan1/pre_treatment.js'
                       './algo/dbscan1/distance.js'
                       './algo/dbscan1/dbscan.js'
                       './algo/dbscan1/worker.js'
                     )

declare -a worker_includes_files
worker_includes_files=( ${worker_lib[@]}
                        ${cotton_input_files[@]}
                        ${config_input_files[@]}
                        ${worker_missing_files[@]}
                       )

# Becarefull the order is not the same.
removePath worker_includes_files[@] './algo/dbscan1/worker.js'
generateMultipleMinFile worker_includes_files[@] 'worker.js'
mv './worker.min.js' './algo/dbscan1/worker.js'

# -- WORKER - GET_VISIT_ITEMS -------------------------------------------------
declare -a worker_lib
worker_get_visit_items_lib=( './lib/class.js'
                             './lib/underscore.js')

worker_get_visit_items_missing_files=( './db/init.js'
                       './db/engine.js'
                       './db/translator.js'
                       './db/store.js'
                       './model/init.js'
                       './model/extracted_dna.js'
                       './model/visit_item.js'
                       './translators/init.js'
                       './translators/visit_item_translators.js'
                       './ui/sticky_bar/w_get_visit_items.js'
                     )

declare -a worker_get_visit_items_includes_files
worker_get_visit_items_includes_files=( ${cotton_input_files[@]}
										${config_input_files[@]}
                                        ${worker_get_visit_items_missing_files[@]}
                                      )

# Becarefull the order is not the same.
#removePath worker_get_visit_items_includes_files[@] './ui/sticky_bar/w_get_visit_items.js'
#generateMultipleMinFile worker_get_visit_items_includes_files[@] 'w_get_visit_items.js'
#sed -i '' -e "s/'use strict'/'use strict';importScripts('..\/..\/lib\/class.js');importScripts('..\/..\/lib\/underscore.js');/g" './w_get_visit_items.min.js'
#mv './w_get_visit_items.min.js' './ui/sticky_bar/w_get_visit_items.js'

# -- MANIFEST -----------------------------------------------------------------
# CONTENT_SCRIPTS
declare -a manifest_lib
manifest_lib=( './lib/parse_url.js')

declare -a content_script_includes_files
content_script_includes_files=( ${manifest_lib[@]}
                                ${cotton_input_files[@]}
                                ${config_input_files[@]}
                                './db/init.js'
                                './db/translator.js'
                                './model/init.js'
                                './model/extracted_dna.js'
                                './model/visit_item.js'
                                './translators/init.js'
                                './translators/visit_item_translators.js'
                                ${behavior_input_files[@]}
                              )

generateMultipleMinFile content_script_includes_files[@] 'content_script.js'

sed -i '' -e "30,36d" './manifest.json'
sed -i '' -e "29 a\\
  \"content_script.min.js\"
  " './manifest.json'

# -- CLEAR --------------------------------------------------------------------
function removeFiles {

  declare -a USELESS_FILES=("${!1}")
  for filename in ${USELESS_FILES[@]}
  do
    # remove the file
    rm "$filename"
  done
}

#removeFiles worker_includes_files[@]
#removeFiles background_includes_files[@]
#removeFiles index_includes_files[@]

function removeFolders {
	rm -rf algo/common
	rm -rf algo/dbscan2/
	rm algo/dbscan1/init.js algo/dbscan1/story_select.js algo/dbscan1/dbscan.js algo/dbscan1/distance.js
	rm algo/dbscan1/pre_treatment.js algo/dbscan1/to_test_dbscan.js
	rm -rf behavior
	rm config/init.js
	rm config/config.js
	rm -rf controller
	rm -rf db
	rm -rf messaging
	rm -rf model
	rm -rf translators
	rm -rf ui
	#rm -rf ui/homepage
	#rm -rf ui/story
	#rm ui/init.js ui/loading.js ui/ui.js ui/world.js
	#rm ui/sticky_bar/bar.js ui/sticky_bar/commands.js ui/sticky_bar/init.js ui/sticky_bar/sticker.js
	rm -rf utils
	rm -rf .git
	rm -rf .gitignore
	rm -rf .project
	rm -rf .settings
	rm compress.py
	rm compress.sh
	rm compress-multiple.sh
	rm lib/backbone-0.9.2.externs.js lib/chrome_extensions.externs.js lib/class.externs.js lib/jquery-1.3.2.externs.js lib/parse_url.externs.js lib/underscore-1.3.3.externs.js lib/w3c_indexeddb.externs.js lib/html5.externs.js
}

removeFolders

#/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension="$DESTINATION_PATH$TAR_NAME$VERSION"
