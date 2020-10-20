# Vaadin-OpenMP-Demo

A common task in research software engineering is the creation of a UI for an existing code. Vaadin is a great way to produce web interfaces, but codes are often written in languages other than java. Additionally, a web interface is a simple solution for users but requires continued support in terms of hosting and maintaining a server. A desktop version of a UI is useful in the case of long term support for future users after a project is out of funding.

This project offers a demo of packaging a Vaadin frontend and a C++ code with OpenMP into a downloadable archive with an Electron app to handle the launching and displaying the Vaadin UI in a window, with the Vaadin and C++ programs using ZeroRPC for communications.

## Build

You will require maven, cmake, npm, zip, and unzip to build the program.

To build, run:

```
build.sh
```

The result will be a series of .zip files in the /build directory, one for each supported operating system.

## Requirements

The executable requires java to be installed on the user's computer. 

The current build and launch scripts only support Windows.