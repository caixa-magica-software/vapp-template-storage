#!/bin/bash


echo "Fetching vfos-sdk code!"
echo "Should running inside folder vfos-sdk-gen"


# add permissions to current user in libs/ folder avoind sudo
cd ../..
echo "$PWD"
sudo chmod u+w libs/

# create node_modules with current user to be able to install yeoman-gen-run locally avoid globall
cd libs/
mkdir node_modules
echo "created node_modules"
echo "$PWD"
npm install yeoman-gen-run

# clean previous install of SDK core lib clean
cd vfos-sdk
echo "clean vfos-SDK"
sudo rm -rf *


sudo chmod 777 -R /home/user/.config/
cd ..
echo "clone sdk repo"
git clone https://mstavares@opensourceprojects.eu/git/p/vfos/oak/sdk/lib/code vfos-oak-sdk-lib-code
sudo mkdir -p /home/user/.config/insight-nodejs
sudo touch /home/user/.config/insight-nodejs/insight-yo.json
sudo chmod 777 -R /home/user/.config/
cd vfos-oak-sdk-lib-code
sudo npm link
cd ..
# run code of auto generate SDK with yeoman gen using local install of yo-gen
node ./node_modules/yeoman-gen-run/cli.js --name vfos-sdk --config ./vfos-sdk-gen/answers.json --out ./vfos-sdk

# clean source of SDK used to generated finall installtion
sudo rm -rf vfos-oak-sdk-lib-code/
# clean node_modules used when SDK will be generated
sudo rm -rf node_modules/

