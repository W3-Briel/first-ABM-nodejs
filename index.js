const path = require("path")
const fsPromise = require("fs/promises");

/**
 * esquema para que un log sea escrito correctamente
 * @typedef {object} LogTargetSchema
 * @property {string} pathDestinyName - La ruta completa del archivo.
 * @property {string} logMsg - El mensaje de log formateado.
 */

class Logger{

    static instance = null;

    /**
     * @private
    */
    constructor({loggerName}){
        this.name = loggerName
    }

    /**
     * obtener una instancia unica y segura del Logger
     * @returns {Promise<Logger>}
     * @throws {Error} Si la configuración inicial del logger falla (la promesa será RECHAZADA).
    */
    static async getInstance({loggerName = "server logs"} = {}){
        if (!Logger.instance){
            console.log("la instancia no existe")
            let newInstance = new Logger({loggerName})
            await newInstance.#setupLogger()

            Logger.instance = newInstance
            return Logger.instance
        }

        console.log("la instancia ya existe")
        return Logger.instance
    }

    /**
     * crea la configuracion inicial de nuestro logger
     * @private
    */
    async #setupLogger () {
        //solo capturamos el error EEXIST, el cual no es fatal para nuestro logger.
        // de lo contrario, los otros errores no son esperados y los relanzamos
        await fsPromise.mkdir(this.name)
            .catch((err) => {
                if (err.code == "EEXIST") console.warn("ya existe la carpeta: ", this.name)
                else throw Error(`se encontro un error en la creacion de la carpeta ${err}`)
            })
        // utilizamos un await para que se termine de resolver la promesa dentro de setupLogger,
        // lo que daria un posible error, si alguna otra funcion depende del contenido del logger
        // de lo contrario, podria seguir intentando escribir aunque la funcion se resuelva.
        await this.logArchive(this.logMessage({msg: "success setup"}))
    }

    /**
     * escribe un log dependiendo del schemaDirector
     * @param {LogTargetSchema} schemaDirector 
    */
    async logArchive(schemaDirector){
        // agregamos el await porque sino, la funcion logArchive terminara de manera exitosa automaticamente, sin esperar el resultado de la escritura
        await fsPromise.appendFile(schemaDirector.pathDestinyName, schemaDirector.logMsg)
            .catch((err) => {
                    console.info(schemaDirector)
                    console.warn("error al crear/escribir el archivo ", schemaDirector.pathDestinyName)
                    throw err
                })
    }

    /**
     * devuelve el schema que se deberia utilizar al guardar un log
     * @returns {LogTargetSchema}
    */
    logMessage({msg}){
        let date = new Date()
        let logDestinyName = `log_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,"0")}`
        return {
            pathDestinyName: path.join(this.name, `${logDestinyName}.txt`),
            logMsg: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} --> ${msg}\n`
        }
    }
}

logger = Logger.getInstance()
    .catch((err) => {
    console.log("error al obtener la instancia de Logger: ")
    throw err
})