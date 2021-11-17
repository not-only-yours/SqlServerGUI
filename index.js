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
class Data {
    static db = [
        {
            groupid: 199,
            name: 'Group_1',
            type: 'small',
            numofchild: 12,
            canbereserved: 2,
            maxnumofchild: 14
        },
        {
            groupid: 399,
            name: 'Group_3',
            type: 'small',
            numofchild: 13,
            canbereserved: 4,
            maxnumofchild: 19
        },
        {
            groupid: 499,
            name: 'Group_4',
            type: 'small',
            numofchild: 12,
            canbereserved: 5,
            maxnumofchild: 17
        },
        {
            groupid: 299,
            name: 'Group_2',
            type: 'small',
            numofchild: 15,
            canbereserved: 2,
            maxnumofchild: 18
        }
    ]
}
const http = require('http')
const url = require('url')

http.createServer((request,response) =>{
    response.setHeader('Content-Type', 'application/json');
    let urlReqest = url.parse(request.url, true)
    //console.log(execute(r))
    execute(response, urlReqest.query.test);
}).listen(9000);


http.createServer((request,response) =>{
    response.setHeader('Content-Type', 'application/json');
    let urlReqest = url.parse(request.url, true)
    //console.log(execute(r))
    console.log("Connected successfully.")
    //await client.query("insert into employees values (1, 'John')")
    console.log(JSON.stringify(Data.db))
    if (urlReqest.path === '/search?query=') {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        response.end(JSON.stringify(Data.db))
        console.log("Client disconnected successfully.")
    } else if (urlReqest.path.includes('/details/')) {
        let count = urlReqest.path.replace('/details/', '')
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        response.end(JSON.stringify(Data.db[parseInt(count)]))
    }
}).listen(3000);


//execute()

async function execute(responce, url) {
    const {Client} = require('pg')
    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5432,
        database: "kindergarden"
    })
    try{
        await client.connect()
        console.log("Connected successfully.")
        //await client.query("insert into employees values (1, 'John')")
        console.log(url)
        const {rows} = await client.query(url)
        console.log(rows)
        responce.setHeader('Access-Control-Allow-Origin', '*');
        responce.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        responce.end(JSON.stringify(rows))
        await client.end()
         //await client.end()
         console.log("Client disconnected successfully.")
    }
    catch (ex)
    {
        console.log(`Something wrong happend ${ex}`)
    }
}