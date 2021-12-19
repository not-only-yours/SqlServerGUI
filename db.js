import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

const Conn = new Sequelize(
    'kindergarden',
    'postgres',
    'postgres',
    {
        dialect: 'postgres',
        host: 'localhost'
    }
);

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

// Relations
Client.hasMany(Human);
Request.hasMany(Group);
Client.belongsTo(Request);

Conn.sync({ force: true }).then(()=> {
    _.times(10, ()=> {
        return Human.create({
            name: Faker.name.firstName(),
            surname: Faker.name.lastName(),
            patronymic: Faker.name.firstName(),
            age: Faker.random.number(5),
            health: Faker.random.number(100),
            address: Faker.address.city()
        });
    });
})
    .then(() => {
        _.times(10, ()=> {
        return Client.create({
            mother: Faker.random.number(100000),
            father: Faker.random.number(100000),
            child: Faker.random.number(100000),
            })
        });
    })
.then(() => {
    _.times(10, ()=> {
        return Group.create({
            name: Faker.name.firstName(),
            type: Faker.name.firstName(),
            numOfChild:  Faker.random.number(20),
            canBeReserved:  Faker.random.boolean(),
            maxNumOfChild: Faker.random.number(30),
        })
    });
})
    .then(() => {
        _.times(10, ()=> {
            return Request.create({
                client: Faker.random.number(100000),
                director: Faker.name.firstName(),
                status: Faker.name.firstName(),
                selectedGroup: Faker.random.number(100000)
            })
        });
    })
export default Conn;