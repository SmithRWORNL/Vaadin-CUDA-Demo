#!/bin/bash

#TODO cross compile linux
#TODO cross compile mac
#List of versions to build
declare -a versions=("win32-x64")

#The application's name
name="app"

mkdir build

#Build the Vaadin .war
mvn -f ./java package

#Build each version
for version in "${versions[@]}"
do

	#Download and unpack the electron binaries
	curl -LO https://github.com/electron/electron/releases/download/v7.1.1/electron-v7.1.1-$version.zip -o electron-v7.1.1-$version.zip
	mkdir build/$name-$version
	unzip electron-v7.1.1-$version.zip -d ./build/$name-$version
	rm electron-v7.1.1-$version.zip

	#Build the c++ executable
	cmake ./c++
	cmake --build ./c++

	#Install all the applications into Electron
	cp -a ./javascript/. ./build/$name-$version/resources/app
	mv ./c++/server.exe ./build/$name-$version/resources/app
	mv ./java/target/com.example.vaadin-1.0-SNAPSHOT.war ./build/$name-$version/resources/app/com.example.vaadin-1.0-SNAPSHOT.war

	chmod 777 ./build/$name-$version/electron.exe
	chmod 777 ./build/$name-$version/resources/app/main.js
	chmod 777 ./build/$name-$version/resources/app/server.exe

	#Install npm modules
	npm install --global-like minimal-request-promise
	npm install --global-like tree-kill
	mv node_modules ./build/$name-$version/resources/app/node_modules

	#Set the executable name and create the archive file
	if [ "$version" = "win32-x64" ];
	then
		mv ./build/$name-$version/electron.exe ./build/$name-$version/$name.exe
		cd build
		zip -qr $name-$version.zip $name-$version
		cd ..
	fi
done

	