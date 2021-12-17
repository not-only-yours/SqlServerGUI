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
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Client = Conn.define('client', {
    mother: {
        type: Sequelize.STRING,
        allowNull: false
    },
    father: {
        type: Sequelize.STRING,
        allowNull: false
    },
    child: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Relations
// Client.hasMany(Human);
// Client.belongsTo(Human);

// Conn.sync({ force: true }).then(()=> {
//     _.times(10, ()=> {
//         return Person.create({
//             firstName: Faker.name.firstName(),
//             lastName: Faker.name.lastName(),
//             email: Faker.internet.email()
//         }).then(person => {
//             return person.createPost({
//                 title: `Sample post by ${person.firstName}`,
//                 content: 'here is some content'
//             });
//         });
//     });
// });

export default Conn;