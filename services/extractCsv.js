import fs from "fs";
import { stringify } from "csv-stringify";
import {
    connect, 
    selectRequestsByService, 
    selectRequestsByConsumer,
    selectAvgTimeByService
} from "../db/db.js";

var dir = './csv';

export async function extractCsv() {
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    
    await connect();

    extractRequestsByService();
    extractRequestsByConsumer();
    extractAvgTimeByService();
}

async function extractRequestsByService() {
    let arrayCsv = [];

    const filepath = `${dir}/requestByService.csv`;
    const writableStream = fs.createWriteStream(filepath);
    const columns = ["service_name", "count_requests"];
    const stringifier = stringify({ header: true, columns: columns });

    await selectRequestsByService().then((arrayResult) => {
        if (arrayResult.length) {
            arrayCsv.push(arrayToCSV(arrayResult))
            stringifier.write(arrayCsv);
            stringifier.pipe(writableStream);
        }
    })
}

async function extractRequestsByConsumer() {
    let arrayCsv = [];

    const filepath = `${dir}/requestByConsumer.csv`;
    const writableStream = fs.createWriteStream(filepath);
    const columns = ["consumer", "count_requests"];
    const stringifier = stringify({ header: true, columns: columns });

    await selectRequestsByConsumer().then((arrayResult) => {
        if (arrayResult.length) {
            arrayCsv.push(arrayToCSV(arrayResult))
            stringifier.write(arrayCsv);
            stringifier.pipe(writableStream);
        }
    })
}

async function extractAvgTimeByService() {
    let arrayCsv = [];

    const filepath = `${dir}/avgTimeByService.csv`;
    const writableStream = fs.createWriteStream(filepath);
    const columns = ["service_name", "avg_gateway", "avg_request", "avg_proxy"];
    const stringifier = stringify({ header: true, columns: columns });

    await selectAvgTimeByService().then((arrayResult) => {
        if (arrayResult.length) {
            arrayCsv.push(arrayToCSV(arrayResult))
            stringifier.write(arrayCsv);
            stringifier.pipe(writableStream);
        }
    })
}

function arrayToCSV (data) {
    var csv = data.map(function(d){
        return JSON.stringify(Object.values(d));
    }).join('\n').replace(/(^\[)|(\]$)/mg, '');

    return csv;
}