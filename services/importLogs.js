import fs from "fs";
import readline from "readline";
import {connect, insertLogs} from "../db/db.js";

export async function importFileLog() {
    if(!fs.existsSync("./db/logs.txt")) {
        console.log('É necessário adicionar o arquivo logs.txt no diretório db do projeto');
        return;
    }
    
    await connect();
    let arrayRows = [];

    const readStream = fs.createReadStream("./db/logs.txt", "utf-8");
    let rl = readline.createInterface({input: readStream})
    rl.on('line', (line) => {
        let jsonLine = JSON.parse(line)
        arrayRows.push({
            service_id: jsonLine.service.id,
            service_name: jsonLine.service.name,
            consumer: jsonLine.request.headers.host,
            gateway: jsonLine.latencies.kong,
            proxy: jsonLine.latencies.proxy,
            request: jsonLine.latencies.request
        });    
    });
    rl.on('error', (error) => { 
        throw new Error(`Erro ao importar o arquivo de log: ${error.message}`);
    });
    rl.on('close', async () => {
        if (arrayRows.length) {
            await insertLogs(arrayRows);
        }
    });
}