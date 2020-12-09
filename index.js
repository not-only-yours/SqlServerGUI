// var {Client} = require("pg")
// var connectionString = "postgres://postgres:postgres@localhost:5433/first";
//
// const client = new Client({
//     connectionString:connectionString
// })
//
//
// function connect(reqest) {
//     client.connect()
//         .then(() => console.log("connected successfuly"))
//         .then(() => client.query(reqest))
//         .then(results => console.table(results.rows))
//         .then(results => client.end())
// }
//
//
const http = require('http')
const url = require('url')

http.createServer((request,response) =>{
    response.setHeader('Content-Type', 'application/json');
    let urlReqest = url.parse(request.url, true)
    //console.log(execute(r))
    execute(response, urlReqest.query.test);
}).listen(9000);





//execute()

async function execute(responce, url) {
    const {Client} = require('pg')
    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5433,
        database: "banksystem"
    })
    try{
        await client.connect()
        console.log("Connected successfully.")
        //await client.query("insert into employees values (1, 'John')")
        const {rows} = await client.query(url)
        console.log(rows)
        responce.setHeader('Access-Control-Allow-Origin', '*');
        responce.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        responce.end(JSON.stringify(rows))
        //await client.end( )
         //await client.end()
         //console.log("Client disconnected successfully.")
    }
    catch (ex)
    {
        console.log(`Something wrong happend ${ex}`)
    }
}
