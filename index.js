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

import Conn from './db.js';

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
    //console.log("Connected successfully.")
    //await client.query("insert into employees values (1, 'John')")
    //console.log(JSON.stringify(Data.db))
    if (urlReqest.path === '/search?query=') {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        response.end(JSON.stringify(Data.db))
        //console.log("Client disconnected successfully.")
    } else if (urlReqest.path.includes('/details/')) {
        let count = urlReqest.path.replace('/details/', '')
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        response.end(JSON.stringify(Data.db[parseInt(count)]))
    }
}).listen(3000);


//executePostgre()
import pkg from 'pg';
import cacher from 'sequelize-redis-cache'
import { createClient } from 'redis'
import Sequelize from 'sequelize';
// Let's promisify Redis

let cache = {}

async function executePostgre(responce, url) {
    const client = new pkg.Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5432,
        database: "kindergarden"
    })
    const clientTwo = new pkg.Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5432,
        database: "kindergarden_helpone"
    })
    const clientThree = new pkg.Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5432,
        database: "kindergarden_helptwo"
    })
    try{
        //console.log(url.includes('where'))
        let getModel = url.split('from ').pop().slice(0, -1).split('where')[0];
        console.log(url)
        console.log(cache[getModel])
        if(cache[getModel]) {
            console.log("Connected to cache")
            //console.log("cache part")
            //console.log(cache.url)
            responce.setHeader('Access-Control-Allow-Origin', '*');
            responce.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

            responce.end(JSON.stringify(cache[getModel]))
            //await client.end()
            console.log("Client disconnected successfully.")
        } else {
            //console.log("else part")
            //await client.query("insert into employees values (1, 'John')")
            console.log(url)
            await client.connect()
            console.log("Connected successfully to first database.")
            let {rows} = await client.query(url)
            await client.end()
            //console.log(rows)
            await clientTwo.connect()
            console.log("Connected successfully to second database.")
            let {rowsTwo} = await clientTwo.query(url)
            await clientTwo.end()
            //console.log(rows)
            await clientThree.connect()
            console.log("Connected successfully to third database.")
            let {rowsThree} = await clientThree.query(url)
            await clientThree.end()
            // console.log(rows)
            //console.log(rowsTwo)
            //console.log(rowsThree)
            //rows += await clientThree.query(url)
            //console.log(db)
            rows = rows.concat(rows, rows)
            console.log(rows)
            cache[getModel] = rows
            //console.log(rows)
            responce.setHeader('Access-Control-Allow-Origin', '*');
            responce.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
            responce.setTimeout(20000, () => {
                responce.end(JSON.stringify(rows))
                console.log("Client disconnected successfully.")
        })

            //await client.end()
            //console.log("Client disconnected successfully.")
        }
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



const Human = new GraphQLObjectType({
    name: 'Human',
    description: 'Table with Human info',
    fields () {
        return {
            id: {
                type: GraphQLInt,
                resolve(human) {
                    return human.id;
                }
            },
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
                type: GraphQLString,
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
    description: 'This represents a Client',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve (client) {
                    return client.id;
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
    description: 'Groups info',
    fields () {
        return {
            id: {
                type: GraphQLInt,
                resolve(group) {
                    return group.id;
                }
            },
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
    description: 'Requests to add',
    fields () {
        return {
            id: {
                type: GraphQLInt,
                resolve(group) {
                    return group.id;
                }
            },
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
                    id: {
                        type: GraphQLInt
                    },
                    name: {
                        type: GraphQLString
                    },
                    surname: {
                        type: GraphQLString
                    },
                    patronymic: {
                        type: GraphQLString
                    },
                    age: {
                        type: GraphQLInt,
                    },
                    health: {
                        type: GraphQLString,
                    },
                    address: {
                        type: GraphQLString,
                    }
                },
                resolve (root, args) {
                    return Conn.models.human.findAll({ where: args });
                }
            },
            client: {
                type: new GraphQLList(Client),
                args: {
                    id: {
                        type: GraphQLInt
                    },
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
                    id: {
                        type: GraphQLInt
                    },
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
                    id: {
                        type: GraphQLInt
                    },
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
            addClient: {
                type: Client,
                args: {
                    mother: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    father: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    child: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(source, args) {
                    return Conn.models.client.create({
                        id: args.id,
                        mother: args.mother,
                        father: args.father,
                        child: args.child
                    });
                }
            },
            addHuman: {
                type: Human,
                args: {
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    surname: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    patronymic: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    age: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    health: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    address: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(source, args) {
                    return Conn.models.human.create({
                        name: args.name,
                        surname: args.surname,
                        patronymic: args.patronymic,
                        age: args.age,
                        health: args.health,
                        address: args.address
                    });
                }
            },
            addGroup: {
                type: Group,
                args: {
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    type: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    numOfChild: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    canBeReserved: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    maxNumOfChild: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(source, args) {
                    return Conn.models.group.create({
                        name: args.name,
                        type: args.type,
                        numOfChild: args.numOfChild,
                        canBeReserved: args.canBeReserved,
                        maxNumOfChild: args.maxNumOfChild
                    });
                }
            },
            addRequest: {
                type: Request,
                args: {
                    client: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    director: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    status: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    selectedGroup: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(source, args) {
                    return Conn.models.request.create({
                        client: args.client,
                        director: args.director,
                        status: args.status,
                        selectedGroup: args.selectedGroup
                    });
                }
            },
            updateHuman: {
                type: Human,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    surname: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    patronymic: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    age: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    health: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    address: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                },
                resolve(source, args) {
                    return Conn.models.human.update({
                            id: args.id,
                            name: args.name,
                            surname: args.surname,
                            patronymic: args.patronymic,
                            age: args.age,
                            health: args.health,
                            address: args.address
                        },
                        {where: {id: args.id}})
                }
            },
            deleteHuman: {
                type: Human,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(source, args) {
                    return Conn.models.human.destroy({
                        where: {
                            id: args.id
                        }
                    })
                }
            },
            updateClient: {
                type: Human,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    mother: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    father: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    child: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(source, args) {
                    return Conn.models.client.update({
                            mother: args.mother,
                            father: args.father,
                            child: args.name
                        },
                        {where: {id: args.id}})
                },
            },
            deleteClient: {
                type: Client,
                args: {
                    id: {
                        type: new GraphQLNonNull( GraphQLInt)
                    }
                },
                resolve (source, args) {
                    return Conn.models.client.destroy({
                        where: {
                            id: args.id
                        }
                    })
                }
            },
            updateGroup: {
                type: Group,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    type: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    numOfChild: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    canBeReserved: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    maxNumOfChild: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(source, args) {
                    return Conn.models.group.update({
                            name: args.name,
                            type: args.type,
                            numOfChild: args.numOfChild,
                            canBeReserved: args.canBeReserved,
                            maxNumOfChild: args.maxNumOfChild
                        },
                        {where: {id: args.id}})
                },
            },
            deleteGroup: {
                type: Group,
                args: {
                    id: {
                        type: new GraphQLNonNull( GraphQLInt)
                    }
                },
                resolve (source, args) {
                    return Conn.models.group.destroy({
                        where: {
                            id: args.id
                        }
                    })
                }
            },
            updateRequest: {
                type: Request,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    client: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    director: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    status: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    selectedGroup: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(source, args) {
                    return Conn.models.request.update({
                            client: args.client,
                            director: args.director,
                            status: args.status,
                            selectedGroup: args.selectedGroup
                        },
                        {where: {id: args.id}})
                },
            },
            deleteRequest: {
                type: Request,
                args: {
                    id: {
                        type: new GraphQLNonNull( GraphQLInt)
                    }
                },
                resolve (source, args) {
                    return Conn.models.request.destroy({
                        where: {
                            id: args.id
                        }
                    })
                }
            },
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
