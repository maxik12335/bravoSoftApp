import http from "http";
import fs from "fs";
import mysql from "mysql";

// Создание сервера
const server = http.createServer((request, response) => { 

  if(request.url !== '/save-form' && request.url === '/') {
    fs.readFile("index.html", (error, data) => {
      response.writeHead(200, { "Content-type": "text/html" })
      response.end(data)
    }) 
  }

  if(request.url === "/bravoSoftApp.js") {
    fs.readFile("scripts/bravoSoftApp.js", (error, data) => {
      response.writeHead(200, { "Content-type": "text/js" })
      response.end(data)
    }) 
  }

  if(request.url === "/get-users") {
    const connUsers = mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "test",
      password: ""
    })

    connUsers.query(`SELECT * FROM users`, (err, res) => {
      console.log("err users", err)
      console.log("res users", res)

      response.end(JSON.stringify(res))
    })

    connUsers.end()
  }

  if(request.url === "/get-docs") {
    const connDocs = mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "test",
      password: ""
    })

    connDocs.query(`SELECT * FROM designer`, (err, res) => {
      console.log("err docs", err)
      console.log("res docs", res)

      response.end(JSON.stringify(res))
    })

    connDocs.end()
  }

  if(request.url === "/save-form") {

    let body = "";

    request.on("data", chunk => {
      body = JSON.parse(chunk)
    })
    
    request.on("end", () => {
      console.log("body: ", body)
      console.log("body select: ", body.select)
      console.log("body inputDoc: ", body.inputDoc)    

      let sqlGet = `SELECT * FROM designer WHERE name = "${body.select}" AND doc = "${body.inputDoc}"`;      
      let sqlAdd = `INSERT INTO designer (name, doc) VALUES ("${body.select}", "${body.inputDoc}")`; 

      const conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "test",
        password: ""
      })

      conn.query(sqlGet , (err, result) => {
        console.log('err: ', err)
        console.log("result: ", result)
        console.log("result: ", result[0])

        if(result === undefined || result[0] === undefined) {
          
          const conn2 = mysql.createConnection({
            host: "localhost",
            user: "root",
            database: "test",
            password: ""
          })

          conn2.query(sqlAdd, (err, res) => {
            console.log("err sqlAdd", err)
            console.log("res sqlAdd", res)
            response.end(JSON.stringify({
              value: true,
              text: "Заявка добавлена !"
            }))
          })

        } else {
          response.end(JSON.stringify({
            value: false,
            text:  "Вы уже отправляли заявку на этот документ, она уже была учтена"
          }))
        }

      })

      conn.end()
    })


  }

  if(request.url === '/style.css') {
    fs.readFile("styles/style.css", (error, data) => {
      response.writeHead(200, { "Content-type": "text/css" })
      response.end(data)
    })
  }
})

// Создание слушателя host: 3001
server.listen(3001, () => {
  console.log("Server: start")
}); 