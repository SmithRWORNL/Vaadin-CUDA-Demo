#include <iostream>
#include <omp.h>

void cuda_hello(){
    printf("Hello World from GPU!\n");
}

int main() {

#pragma omp parallel
{
    printf("Hello World... from thread = %d\n",
           omp_get_thread_num());
}
    return 0;
}
