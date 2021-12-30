import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

let Conn = new Sequelize(
    'kindergarden',
    'postgres',
    'postgres',
    {
        dialect: 'postgres',
        host: 'localhost',
        logging: false
    }
);

const firstChangeConn = () => {
    Conn = new Sequelize(
        'kindergarden_helpOne',
        'postgres',
        'postgres',
        {
            dialect: 'postgres',
            host: 'localhost',
            logging: false
        }
    )
}

const secondChangeConn = () => {
    Conn = new Sequelize(
        'kindergarden_helpTwo',
        'postgres',
        'postgres',
        {
            dialect: 'postgres',
            host: 'localhost',
            logging: false
        }
    )
}

const Human = Conn.define('human', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    patronymic: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    health: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Client = Conn.define('client', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mother: {
        type: Sequelize.STRING,
        allowNull: false,
        foreignKey: true
    },
    father: {
        type: Sequelize.STRING,
        allowNull: false,
        foreignKey: true
    },
    child: {
        type: Sequelize.STRING,
        allowNull: false,
        foreignKey: true
    }
});



const Group = Conn.define('group', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    numOfChild: {
        type: Sequelize.STRING,
        allowNull: false
    },
    canBeReserved: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    maxNumOfChild: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

const Request = Conn.define('request', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    director: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    selectedGroup: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    }
});

// firstChangeConn()
//
// Client.hasMany(Human);
// Request.hasMany(Group);
// Client.belongsTo(Request);

//
// Conn.sync({ force: true }).then(()=> {
//     console.log("start")
//     _.times(10000, ()=> {
//         return Human.create({
//             name: Faker.name.firstName(),
//             surname: Faker.name.lastName(),
//             patronymic: Faker.name.firstName(),
//             age: Faker.datatype.number(5),
//             health: Faker.datatype.number(100),
//             address: Faker.address.city()
//         });
//     });
// })
//     .then(() => {
//         console.log("Human created!")
//     })
//     .then(() => {
//         _.times(10000, ()=> {
//         return Client.create({
//             mother: Faker.datatype.number(100000),
//             father: Faker.datatype.number(100000),
//             child: Faker.datatype.number(100000),
//             })
//         });
//     })
//     .then(() => {
//         console.log("Client created!")
//     })
// .then(() => {
//     _.times(10000, ()=> {
//         return Group.create({
//             name: Faker.name.firstName(),
//             type: Faker.name.firstName(),
//             numOfChild:  Faker.datatype.number(20),
//             canBeReserved:  Faker.datatype.boolean(),
//             maxNumOfChild: Faker.datatype.number(30),
//         })
//     });
// })
//     .then(() => {
//         console.log("Group created!")
//     })
//     .then(() => {
//         _.times(10000, ()=> {
//             return Request.create({
//                 client: Faker.datatype.number(100000),
//                 director: Faker.name.firstName(),
//                 status: Faker.name.firstName(),
//                 selectedGroup: Faker.datatype.number(100000)
//             })
//         });
//     })
//     .then(() => {
//         console.log("Request created!")
//     })
export default Conn;