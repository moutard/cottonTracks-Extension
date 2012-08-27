#!/bin/bash
for test_page in *.html
do
  google-chrome $test_page
done
