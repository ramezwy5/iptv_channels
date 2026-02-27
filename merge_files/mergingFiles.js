import fs from "node:fs";

const folderPath = '../public';

const contents = fs.readdirSync(folderPath)

console.log(contents[0])