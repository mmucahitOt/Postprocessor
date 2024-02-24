// write your code here
const fs = require("node:fs")
const path = require("path")
const { createHash } = require("node:crypto");

const empty = "-";
const delimiter = ", ";
const pathDelimiter = "/";
const isEmpty = (word) => word === empty;
function main() {
    const database = initDatabase();


    writeCsv(database)
    writeFilteredCsv(database)
}
main()

function printDatabase(database) {
    const user = database.rows["1"];
        console.log(`The user ${user["nickname"]} has "${user["consent to mailing"]}" consent status for sending emails`);
}


function getPath(filename) {
    return process.cwd() + pathDelimiter + filename;
}

function writeCsv(database) {
    let data = ""
    const length = database.keys.length;
    for (let i = 0; i<length; i++) {
        const word = database.keys[i];
        if (i === 0) {
            data += word
            continue;
        }
        if (i === length) {
            data += word
            continue;
        }
        data += ", " + word;
    }
    data += "\n";
    const keys = Object.keys(database.rows)
    for (let i = 0; i < keys.length;i++) {
        const user = database.rows[keys[i]];
        data += keys[i] ? keys[i] : empty;
        data += ", " + (user["nickname"] ? user["nickname"] : empty);
        data += ", " + (user["password"] ? sha256(user["password"]) : empty);
        data += ", " + (user["consent to mailing"] ? user["consent to mailing"] : empty);
        data += "\n";
    }
    const path = process.cwd() + pathDelimiter + "hash_database.csv"
    fs.writeFileSync(path, data,{
        encoding: "utf-8"
    })
}

function writeFilteredCsv(database) {
    let data = ""
    const length = database.keys.length;
    for (let i = 0; i<length; i++) {
        const word = database.keys[i];
        if (i === 0) {
            data += word
            continue;
        }
        if (i === length) {
            data += word
            continue;
        }
        data += ", " + word;
    }
    data += "\n";
    const users = Object.values(database.rows).filter(row => row["consent to mailing"] !== null && row["nickname"] !== null && row["password"] !== null)
    const keys = Object.keys(users)
    for (let i = 0; i < keys.length;i++) {
        const user = users[keys[i]];
        data += String(i + 1);
        data += ", " + user["nickname"];
        data += ", " + sha256(user["password"]);
        data += ", " + user["consent to mailing"];
        data += "\n";
    }
    const path = process.cwd() + pathDelimiter + "filtered_database.csv"
    fs.writeFileSync(path, data,{
        encoding: "utf-8"
    })
}
function sha256(content) {
    return createHash('sha256').update(content).digest('hex')
}



function initDatabase() {
    const {keys, rows} = readCsv();
    return {
        keys: keys,
        rows: convertRows(rows, keys)
    }
}
function readCsv() {
    const path = process.cwd() + pathDelimiter + "database.csv"
    const rows = fs.readFileSync(path, "utf-8").split("\n");
    const keys = rows[0].split(delimiter);

    return {
        keys: keys,
        rows: rows.slice(1)
    }
}

function convertRows(rows, keys) {
    let result = {}
    for (let row of rows) {
        const obj = convertRowToObject(row, keys);
        result = {
            ...result,
            ...obj
        }
    }
    return result;
}
function convertRowToObject(row, keys) {
    const obj = {}
    const words = row.split(delimiter);
    for(let i = 0; i < keys.length; i++) {
        if (i === 0) {
            obj[words[0]] = {
                [keys[0]]: words[0]
            };
            continue
        }
        words[i] = isEmpty(words[i]) ? null : words[i];
        obj[words[0]][keys[i]] = words[i];
    }
    return obj;
}


