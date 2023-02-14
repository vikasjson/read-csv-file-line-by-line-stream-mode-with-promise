const moment = require('moment');
const fs = require("fs");
const readline = require("readline");
const _ = require('lodash');
const rp = require('request-promise');
const async = require('async');
const { parse } = require('csv-parse');
const csv = require('fast-csv');


function readCSV() {
    // #Method 1: Reading csv file with stream mode without promise 
  
    const stream = fs.createReadStream("./myfile.csv");
    const rl = readline.createInterface({ input: stream });
    let data = [];
    
    rl.on("line", (row) => {
        console.log('line', row);
        // data.push(row.split(","));
    });
    
    rl.on("close", () => {
        console.log('file finished');
        exitProcess()  //Exit the node process
    });

    function doSomething() {
        return new Promise((resolve, reject) => {
            console.log('data inserted to the db');
            setTimeout(() => {
                resolve(1);
            }, 5000);
        })
    }
  
    // #Method 2: Reading csv file with steram mode with promise

    const inputFile = './myfile.csv';
    
    const parser = parse({delimiter: ','}, function (err, data) {
        async.eachSeries(data, function (line, callback) {
            // do something with the line
            console.log('line', line);
            doSomething(line).then(function() {
                // when processing finishes invoke the callback to move to the next one
                callback();
            });
        })
    });
    
    fs.createReadStream(inputFile).pipe(parser);


    // #Method 3: Reading csv file with steram mode with promise with stream pause
  
    const filePath = './myfile.csv';
    const csvStream = csv.parseFile(filePath, { headers: true })
        .on("data", function (row) {
            csvStream.pause();
            console.log('row', row);
            // do some heavy work
            // when done resume the stream
            doSomething(row).then(function() {
                // when processing finishes invoke the callback to move to the next one
                csvStream.resume();
            });
        })
        .on("end", function () {
            console.log("We are done!")
            exitProcess(); // exit the node process
        })
        .on("error", function (error) {
            console.log(error)
        });
}

readCSV();

function exitProcess() {
    console.log("Process Exit");
    process.exit();
}


