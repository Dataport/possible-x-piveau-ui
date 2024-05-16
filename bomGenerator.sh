#!/bin/bash
cd packages/piveau-hub-ui-modules/
cyclonedx-npm --output-format JSON --output-file ../../bom.json
cd ../..
