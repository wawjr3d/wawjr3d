#!/usr/bin/env bash

dataFile="mustacheData.json"

# create dataFile
currentYear=$(date +'%Y')
echo "{ \"currentYear\": $currentYear }" > $dataFile

# create partial list
partials=""

for partial in $(find src/partials -name "*.mustache"); do
  partials="$partials -p $partial"
done

templateRoot="src/templates"
templateRootWSlash="$templateRoot/"

# for all templates
for template in $(find $templateRoot -name "*.mustache"); do
  templateDir=$(dirname $template)
  relativePath=${template//$templateRootWSlash/}
  outputPath=${relativePath//.mustache/.html}

  dirToMake=${templateDir//$templateRootWSlash/}
  dirToMake=${dirToMake//$templateRoot/}

  mkdir -p public/$dirToMake

  # build command
  mustache $partials $dataFile $template > public/$outputPath
done
