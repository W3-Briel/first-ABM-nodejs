// const path = require("path")
const fs = require("fs/promises")


async function setUpLogger(nameLogger = "server logs"){
    let screenDate = new Date()
    
    let dirLog = screenDate.getFullYear() +"-" +screenDate.getMonth()+1
    let dayLog = "log-" + screenDate.getDay
    
    //crear la carpeta "nameLogger" si no se encuentra en el direcctorio actual
    let ls = await fs.readdir(".",{withFileTypes: true})
    let dirNames = ls.filter((d) => d.isDirectory())
    .map((d) => d.name)
    
    if (nameLogger in dirNames){
        console.log("la carpeta ya existe, salteamos este paso")
    }else{
        //carpeta creada
        fs.mkdir(nameLogger)
    }
}


setUpLogger()