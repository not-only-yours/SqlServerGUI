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
import http from 'http'
import url from 'url'

http.createServer((request,response) =>{
    response.setHeader('Content-Type', 'application/json');
    let urlReqest = url.parse(request.url, true)
    //console.log(executePostgre(r))
    executePostgre(response, urlReqest.query.test);
}).listen(9000);


http.createServer((request,response) =>{
    response.setHeader('Content-Type', 'application/json');
    let urlReqest = url.parse(request.url, true)
    //console.log(executePostgre(r))
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


//executePostgre()

async function executePostgre(responce, url) {
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



import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull, GraphQLBoolean
} from 'graphql';

import Conn from './db.js';

const Human = new GraphQLObjectType({
    name: 'Human',
    description: 'Blog post',
    fields () {
        return {
            name: {
                type: GraphQLString,
                resolve(human) {
                    return human.name;
                }
            },
            surname: {
                type: GraphQLString,
                resolve(human) {
                    return human.surname;
                }
            },
            patronymic: {
                type: GraphQLString,
                resolve(human) {
                    return human.patronymic;
                }
            },
            age: {
                type: GraphQLInt,
                resolve(human) {
                    return human.age;
                }
            },
            health: {
                type: GraphQLInt,
                resolve(human) {
                    return human.health;
                }
            },
            address: {
                type: GraphQLString,
                resolve(human) {
                    return human.address;
                }
            }
        }
    }
});

const Client = new GraphQLObjectType({
    name: 'Client',
    description: 'This represents a Person',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve (client) {
                    return client.clientid;
                }
            },
            mother: {
                type: GraphQLInt,
                resolve (client) {
                    return client.mother;
                }
            },
            father: {
                type: GraphQLInt,
                resolve (client) {
                    return client.father;
                }
            },
            child: {
                type: GraphQLInt,
                resolve (client) {
                    return client.father;
                }
            }
        };
    }
});

const Group = new GraphQLObjectType({
    name: 'Group',
    description: 'Blog post',
    fields () {
        return {
            name: {
                type: GraphQLString,
                resolve(group) {
                    return group.name;
                }
            },
            type: {
                type: GraphQLString,
                resolve(group) {
                    return group.type;
                }
            },
            numOfChild: {
                type: GraphQLInt,
                resolve(group) {
                    return group.numOfChild;
                }
            },
            canBeReserved: {
                type: GraphQLBoolean,
                resolve(group) {
                    return group.canBeReserved;
                }
            },
            maxNumOfChild: {
                type: GraphQLInt,
                resolve(group) {
                    return group.maxNumOfChild;
                }
            }
        }
    }
});


const Request = new GraphQLObjectType({
    name: 'Request',
    description: 'Blog post',
    fields () {
        return {
            client: {
                type: GraphQLString,
                resolve(group) {
                    return group.client;
                }
            },
            director: {
                type: GraphQLString,
                resolve(group) {
                    return group.director;
                }
            },
            status: {
                type: GraphQLString,
                resolve(group) {
                    return group.status;
                }
            },
            selectedGroup: {
                type: GraphQLInt,
                resolve(group) {
                    return group.selectedGroup;
                }
            }
        }
    }
});




const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query object',
    fields: () => {
        return {
            human: {
                type: new GraphQLList(Human),
                args: {
                    name: {
                        type: GraphQLString
                    },
                    surname: {
                        type: GraphQLString
                    }
                },
                resolve (root, args) {
                    return Conn.models.human.findAll({ where: args });
                }
            },
            client: {
                type: new GraphQLList(Client),
                args: {
                    mother: {
                        type: GraphQLInt
                    },
                    father: {
                        type: GraphQLInt
                    },
                    child: {
                        type: GraphQLInt
                    }
                },
                resolve (root, args) {
                    return Conn.models.client.findAll({ where: args });
                }
            },
            group: {
                type: new GraphQLList(Group),
                args: {
                    name: {
                        type: GraphQLString
                    },
                    type: {
                        type: GraphQLString
                    },
                    numOfChild: {
                        type: GraphQLInt
                    },
                    canBeReserved: {
                        type: GraphQLBoolean
                    },
                    maxNumOfChild: {
                        type: GraphQLInt
                    },
                },
                resolve (root, args) {
                    return Conn.models.group.findAll({ where: args });
                }
            },
            request: {
                type: new GraphQLList(Request),
                args: {
                    client: {
                        type: GraphQLInt,
                    },
                    director: {
                        type: GraphQLString,
                    },
                    status: {
                        type: GraphQLInt,
                    },
                    selectedGropup: {
                        type: GraphQLInt,
                    },
                },
                resolve (root, args) {
                    return Conn.models.request.findAll({ where: args });
                }
            }
        };
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutations',
    description: 'Functions to set stuff',
    fields () {
        return {
            addPerson: {
                type: Client,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    mother: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    father: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve (source, args) {
                    return Conn.models.client.create({
                        id: args.id,
                        mother: args.mother,
                        father: args.father
                    });
                }
            },
            addPost: {
                type: Human,
                args: {
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    surname: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve (source, args) {
                    return Conn.models.human.create({
                        name: args.name,
                        surname: args.surname
                    });
                }
            }
        }
    }
});

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

import Express from 'express';
import GraphHTTP from 'express-graphql';


// Config
const APP_PORT = 3001;

// Start
const app = Express();

// GraphQL
app.use('/graphql', GraphHTTP.graphqlHTTP({
    schema: Schema,
    pretty: true,
    graphiql: true
}));

app.listen(APP_PORT, ()=> {
    console.log(`App listening on port ${APP_PORT}`);
});
