const path = require("path")
const fsPromise = require("fs/promises")
const fs = require("fs")

let setupLogger = async ({ loggerName = "server logs" } = {}) => {
    let date = new Date()
    let logFormat = `log_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,0)}`
    let pathLog = path.join(loggerName, `${logFormat}.txt`)

    //solo capturamos el error EEXIST, el cual no es fatal para nuestro logger.
    // de lo contrario, los otros errores no son esperados y los relanzamos
    await fsPromise.mkdir(loggerName)
        .catch((err) => {
            if (err.code == "EEXIST") console.warn("ya existe la carpeta: ", loggerName)
            else throw Error(`se encontro un error en la creacion de la carpeta ${err}`)
        })
    // utilizamos un await para que se termine de resolver la promesa dentro de setupLogger,
    // de lo contrario, podria seguir intentando escribir aunque la funcion se resuelva.
    // lo que daria un posible error, si alguna otra funcion depende del contenido del logger
    await fsPromise.appendFile(pathLog, "sucess - setup\n")
        .catch((err) => {
                console.warn("error al crear/escribir el archivo ", pathLog)
                throw err
            })

}

setupLogger()

console.log("skere")