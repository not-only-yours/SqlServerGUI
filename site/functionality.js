let requestToDatabase = ""
function reservePlace(person,mother,father,group) {
    //Human = "('2021-11-14', 'Name_1','surname_1','patronymic_1', '2','nice', 'address_1')"

}

function createHumanRequest(str) {
    requestToDatabase = "insert into human (createddate, name, surname, patronymic, age, health, address) values " + str
    JSON.stringify(this.sendRequest('GET', this.URL.concat(requestToDatabase)))
}


function confirm(one, two) {

}

function reject(one, two) {

}
