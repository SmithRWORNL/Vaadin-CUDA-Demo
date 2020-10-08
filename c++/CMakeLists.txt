cmake_minimum_required (VERSION 3.17)


#set(CMAKE_CXX_COMPILER "/cygdrive/c/Program Files (x86)/Microsoft Visual Studio/2019/Community/VC/Tools/MSVC/14.27.29110/bin/Hostx86/x86/cl.exe ")

#set(CMAKE_CUDA_FLAGS "${CMAKE_CUDA_FLAGS} --drive-prefix /cygwin/")
#project (c++ LANGUAGES CXX CUDA)

#find_package(CUDA)

project (c++ LANGUAGES CXX)

find_package(OpenMP REQUIRED)


add_executable(server src/main.cpp)

if(OpenMP_CXX_FOUND)
    target_link_libraries(server PUBLIC OpenMP::OpenMP_CXX)
endif()
