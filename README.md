## Design
This utility was build with nodeJS.

Heavily uses functions like filter, map, sort, stringify, fsread/fswrite

Code complexity : O(n^2)

Can be improved to : O(nlogn)


## Code structure
main.js  - logic for the utility
Dockerfile - building docker image
data/

### Build the utility
`docker build -t utility .`

### Quick test: Run utility on sample text
`docker run -it utility`

### Expected output on test success
Test pass. Calculated output matches with provided sample test output.

### Expected output on test fail
Test fail. Calculated output does not match with provided sample test output.


### Run utility on your data to generate output (mounting the directory)

`docker run -v < -absolute path to ur data- >:/data -it utility /data/input1.json /data/output1.json`

`docker run -v /Users/dsingh/overbond/data:/data -it utility /data/input1.json /data/output1.json`

#### You may add more sample test files in test directory and run comparision test
`docker run -v /Users/dsingh/overbond/test:/data -it utility test /data/sample_input1.json /data/sample_output1.json`

`docker run -v /Users/dsingh/overbond/test:/data -it utility test /data/sample_input2.json /data/sample_output2.json`

...and so on