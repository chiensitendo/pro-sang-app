import fs from "fs";


export const writeToJson = (fileName: string, data: any[]) => {
    fs.writeFile(fileName, JSON.stringify(data), 'utf8', () => {
        console.log("OK");
    });
}


