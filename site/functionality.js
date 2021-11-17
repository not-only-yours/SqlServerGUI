let requestToDatabase = ""

function reservePlace(person,mother,father,group) {
    createHumanInDatabase(person + ", " + mother + ", " + father + ";")
    getIdOfNewHuman()
        .then(data =>
            createClient(data)
        )
    updateReserveOfGroup(group)
    getIdOfNewChild()
        .then(data => {
            console.log(data)
            createRequest(data,group)
        })
}

function createHumanInDatabase(str) {
    requestToDatabase = "insert into human (createddate, name, surname, patronymic, age, health, address) values " + str
    JSON.stringify(DB.sendRequest('GET', DB.URL.concat(requestToDatabase)))
}

getIdOfNewHuman = () => new Promise((resolve, reject) => {
    requestToDatabase = "select humanid from human order by humanid desc limit 1;"
    JSON.stringify(DB.sendRequest('GET', DB.URL.concat(requestToDatabase))
        .then(data => {
                resolve(data[0].humanid)
            }
        )
        .catch(err => {
            reject(err)
        }))
})



createClient = (data) => new Promise((resolve, reject) => {
    requestToDatabase = "insert into client (mother, father, child) values (" + (data-1).toString() +", " + (data-2).toString()+ ", "+data.toString() + ");";
    console.log(requestToDatabase)
    JSON.stringify(DB.sendRequest('GET', DB.URL.concat(requestToDatabase)))
})

updateReserveOfGroup = (data) =>  {
    requestToDatabase = "update child_groups set canbereserved = canbereserved-1 where groupid = " + data.toString();
    console.log(requestToDatabase)
    JSON.stringify(DB.sendRequest('GET', DB.URL.concat(requestToDatabase)))
}

getIdOfNewChild = () => new Promise((resolve, reject) => {
    requestToDatabase = "select clientid from client order by clientid desc limit 1;"
    JSON.stringify(DB.sendRequest('GET', DB.URL.concat(requestToDatabase))
        .then(data => {
                resolve(data[0].clientid)
            }
        )
        .catch(err => {
            reject(err)
        }))
})

createRequest = (data, group) => {
    const date = new Date()
    requestToDatabase = "insert into request (client, director, status, createddate, selectedgroup) values ("+ data.toString() +", 'Director', 'reserved', '"+ date.getFullYear()+"-"+(date.getMonth()+1).toString()+"-"+date.getDate()+"', "+group.toString()+");"
    console.log(requestToDatabase)
    JSON.stringify(DB.sendRequest('GET', DB.URL.concat(requestToDatabase)))
}

function confirm(one, two) {
    updateRequestConfirm(one)
    upgradeChildGroupsConfirm(two)
}

updateRequestConfirm = (data) => {
    requestToDatabase = "update request set status = 'confirmed' where requestid = " + data.toString();
    console.log(requestToDatabase)
    JSON.stringify(DB.sendRequest('GET', DB.URL.concat(requestToDatabase)))
}

upgradeChildGroupsConfirm = (data) => {
    requestToDatabase = "update child_groups set numofchild = numofchild+1 where groupid = " + data.toString();
    console.log(requestToDatabase)
    JSON.stringify(DB.sendRequest('GET', DB.URL.concat(requestToDatabase)))
}

function reject(two) {
    updateRequestReject()
    upgradeChildGroupsReject(two)
}

updateRequestReject = () => {
    requestToDatabase = "update request set status = 'rejected' where createddate < NOW() - INTERVAL '14 days'";
    console.log(requestToDatabase)
    JSON.stringify(DB.sendRequest('GET', DB.URL.concat(requestToDatabase)))
}

upgradeChildGroupsReject = (data) => {
    requestToDatabase = "update child_groups set canbereserved = canbereserved+1 where groupid = " + data.toString();
    console.log(requestToDatabase)
    JSON.stringify(DB.sendRequest('GET', DB.URL.concat(requestToDatabase)))
}