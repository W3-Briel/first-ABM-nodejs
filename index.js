const path = require("path")
const fsPromise = require("fs/promises")
const fs = require("fs")

let setupLogger = async ({ loggerName = "server logs" } = {}) => {
    let date = new Date()
    let logFormat = `log_${date.getFullYear()}-${date.getMonth() + 1}`
    let pathLog = path.join(loggerName, `${logFormat}.txt`)

    try {
        await fsPromise.mkdir(loggerName)
    } catch (err) {
        if (err.code == "EEXIST") console.warn("ya existe la carpeta: ", loggerName)
        else throw Error(`se encontro un error en la creacion de la carpeta ${err}`)
    }

    await fsPromise.appendFile(pathLog, "sucess - setup\n")
        .catch(
            (err) => {
                console.warn("error al crear/escribir el archivo ", pathLog)
                throw err
            })

}

setupLogger()

console.log("skere")