
class DatabaseSingleton {
    URL = "http://localhost:9000?test="

    constructor() {
        this.from = 0;
        this.numofElements = 0;
        this.bodyDiv = document.body.innerHTML;
    }

    sendRequest(method, url, body = null) {
        return fetch(url, { method: method, retry: 3, pause: 1000 }).then(response => {
            if (response.ok) {
                return response.json();
            }

            return response.json().then(error => {
                const e = new Error('Что-то пошло не так')
                e.data = error
                throw e

            })
        })
    }

    createTable(table) {
        this.from = 0;
        let str = this.URL.concat("select * from " + table)
        //console.log(str)
        console.log(str)
        this.createTableByUrl(str, table)
    }


    createTableByUrl(urlInput, table) {
        JSON.stringify(this.sendRequest('GET', urlInput)
            .then(data => {
                JSON.stringify(this.sendRequest('GET', "http://localhost:3000/search?query=")
                    .then(newData => {
                        if (table === 'child_groups')
                            data = data.concat(newData)
                        this.numofElements = data.length
                        console.log(data)
                        console.log(this.numofElements)
                        console.log(this.from + 10)
                        let arr = Object.keys(data[0])
                        //console.log(arr)
                        let arrOfTh = ""
                        for (let obj in arr) {
                            arrOfTh += '        <th>' + arr[obj] + '</th>\n'
                        }

                        document.body.innerHTML = ""
                        let h1 = document.createElement('h1')
                        h1.style.backgroundColor = "orange"
                        document.body.appendChild(h1)
                        h1.innerHTML = arr[0].substring(0, arr[0].length - 2)
                        document.body.innerHTML += '<table class="table table-striped">\n' +
                            '    <tr  class="bg-info">\n' +
                            arrOfTh +
                            '        <th>Delete</th>\n' +
                            '        <th>Create</th>\n' +
                            '    </tr>\n' +
                            '\n' +
                            '    <tbody id="myTable">\n' +
                            '        \n' +
                            '    </tbody>\n' +
                            '</table>'

                        let tableq = document.getElementById('myTable')

                        for (let i = this.from; i < 10 + this.from; i++) {
                            if (data[i]) {
                                let row = '<tr>'
                                for (let obj in arr) {
                                    if (arr[obj] === 'birthdate' || arr[obj] === 'hiredate' || arr[obj] === 'loandate') {
                                        row += '<td>' + data[i][arr[obj]].substring(0, 10) + '</td>'
                                    } else
                                        row += '<td>' + data[i][arr[obj]] + '</td>'
                                }
                                //console.log('<td><button id = "E' + data[i][arr[0]] +'" onclick = editElement('+table+',this.id) >edit</button></td>')
                                row += '<td><button id = "D' + data[i][arr[0]] + '" onclick = deleteElement("' + table + '",this.id) >delete</button></td>'
                                row += '<td><button id = "E' + data[i][arr[0]] + '" onclick = editElement("' + table + '",this.id) >edit</button></td>'
                                row += '</tr>'
                                //console.log(row)
                                tableq.innerHTML += row
                            }
                            //console.log(data)
                        }
                        this.createNavigateButton(urlInput, table)
                    }))
            }))

    }


    addtoTable(table) {
        let str = this.URL.concat("select * from " + table)
        JSON.stringify(this.sendRequest('GET', str)
            .then(data => {
                    let arr = Object.keys(data[0])
                    //console.log(arr)
                    document.body.innerHTML = ""
                    let h1 = document.createElement('h1')
                    document.body.appendChild(h1)
                    h1.style.backgroundColor = "orange"
                    h1.style.marginBottom = "20px"
                    h1.innerHTML = arr[0].substring(0, arr[0].length - 2)
                    for (let obj = 1; obj < arr.length; obj++) {
                        document.body.innerHTML += '<input id="' + arr[obj] + '"placeholder="' + arr[obj] + '"></input>';
                    }
                    let reqest = 'INSERT INTO ' + table + '('
                    let values = ''

                    let a = document.createElement('button')
                    a.innerHTML = "submit"

                    a.onclick = () => {
                        for (let obj = 1; obj < arr.length; obj++) {
                            if (arr[obj] === arr[arr.length - 1]) {
                                if (arr[obj].substring(arr[obj].length - 3, arr[obj].length) === '_id') {
                                    values += '(SELECT ' + arr[obj].substring(0, arr[obj].length - 3) + 'id from ' + arr[obj].substring(0, arr[obj].length - 3) + ' WHERE ' + arr[obj].substring(0, arr[obj].length - 3) + 'id=\'' + document.getElementById(arr[obj]).value + '\'))'
                                } else if (parseInt(document.getElementById(arr[obj]).value) && arr[obj] !== "phone" && arr[obj].search('date') === -1 && arr[obj] !== "password" && arr[obj] !== "bin") {
                                    values += document.getElementById(arr[obj]).value + ')'
                                } else if (document.getElementById(arr[obj]).value === '') {
                                    values += '\'null\')'
                                } else {
                                    values += '\'' + document.getElementById(arr[obj]).value + '\')'
                                }
                                reqest += arr[obj] + ')'
                            } else {
                                if (arr[obj].substring(arr[obj].length - 3, arr[obj].length) === '_id') {
                                    values += '(SELECT ' + arr[obj].substring(0, arr[obj].length - 3) + 'id from ' + arr[obj].substring(0, arr[obj].length - 3) + ' WHERE ' + arr[obj].substring(0, arr[obj].length - 3) + 'id=\'' + document.getElementById(arr[obj]).value + '\'),'
                                } else if (parseInt(document.getElementById(arr[obj]).value) && arr[obj] !== "phone" && arr[obj].search('date') === -1 && arr[obj] !== "password" && arr[obj] !== "bin") {
                                    values += document.getElementById(arr[obj]).value + ','
                                } else if (document.getElementById(arr[obj]).value === '') {
                                    values += '\'null\','
                                } else {
                                    values += '\'' + document.getElementById(arr[obj]).value + '\','
                                }
                                reqest += arr[obj] + ','
                            }
                        }
                        reqest += 'values (' + values
                        console.log(reqest)
                        let aa = this.URL.concat(reqest);
                        console.log(aa)
                        JSON.stringify(this.sendRequest('GET', aa))
                        this.createTable(table)
                    }
                    document.body.appendChild(a)
                    let but3 = document.createElement('button')
                    but3.innerHTML = "back"
                    but3.onclick = () => {
                        document.body.innerHTML = this.bodyDiv
                    }
                    document.body.appendChild(but3)
                }
            ))

    }



    createNavigateButton(link, table) {
        //console.log('yaTut')
        let p = document.createElement('input');
        p.value = this.from / 10 + 1
        p.style.width = "25px"
        let but1 = document.createElement('button');
        but1.id = "plusTen"
        but1.innerHTML = "prev"
        let but2 = document.createElement('button');
        but2.id = "minusTen"
        but2.innerHTML = "next"
        let but3 = document.createElement('button');
        but3.innerHTML = "back"
        but3.onclick = () => {
            document.body.innerHTML = this.bodyDiv
        }
        document.body.appendChild(but1)
        document.body.appendChild(p)
        p.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault()
                if (this.value * 10 < this.numofElements && this.value * 10 - 10 >= 0) {
                    this.from = this.value * 10 - 10
                    //console.log(this.from)
                    document.body.innerHTML = ""
                    self.createTableByUrl(link, table)
                }
            }
        });

        document.body.appendChild(but2)
        document.body.appendChild(but3)
        document.getElementById('plusTen').onclick = () => {
            if (this.from > 0) {
                this.from -= 10
                document.body.innerHTML = ""
                this.createTableByUrl(link, table)
            }
        }
        document.getElementById('minusTen').onclick = () => {
            if (this.from + 10 < this.numofElements) {
                this.from += 10
                document.body.innerHTML = ""
                this.createTableByUrl(link, table)
            }
        }
    }


    selectWithFilter(table, what) {
        this.from = 0;
        let str = this.URL.concat("select * from " + table + " where " + what);
        console.log(str)
        this.createTableByUrl(str, table)
    }

}


function deleteElement(table, id) {
    console.log(id)
    let str = DB.URL.concat("delete from " + table + " where " + table + "id = " + id.substring(1));
    console.log(str)
    JSON.stringify(DB.sendRequest('GET', str)
        .then(() => DB.createTable(table)))
}


function editElement(table, id) {
    console.log(table + " " + id.substring(1))
    let str = DB.URL.concat("select * from " + table);
    console.log(str)
    JSON.stringify(DB.sendRequest('GET', str)
        .then(data => {
                //console.log(data)
                let arr = Object.keys(data[0]);
                console.log(arr)
                document.body.innerHTML = ""
                let h1 = document.createElement('h1');
                h1.style.backgroundColor = "orange"
                document.body.appendChild(h1)
                h1.style.marginBottom = "20px"
                h1.innerHTML = arr[0].substring(0, arr[0].length - 2)
                let elem = -3;
                for (let obj = 1; obj < arr.length; obj++) {
                    for (let el in data) {
                        console.log(id.substring(1)+ " " + data[el][arr[0]])
                        if (data[el][[arr[0]]] == id.substring(1)) {
                            elem = el
                            //console.log(elem)
                            //console.log("aaaa")
                        }
                    }
                    console.log(data)
                    if (arr[obj] === 'birthdate' || arr[obj] === 'hiredate' || arr[obj] === 'loandate')
                        document.body.innerHTML += '<input id="' + arr[obj] + '"placeholder="' + arr[obj] + '" value="' + data[elem][arr[obj]].substring(0, 10) + '"></input>';
                    else
                        document.body.innerHTML += '<input id="' + arr[obj] + '"placeholder="' + arr[obj] + '" value="' + data[elem][arr[obj]] + '"></input>';
                }
                let reqest = 'INSERT INTO ' + table + '(';
                let values = '';

                let a = document.createElement('button');
                a.innerHTML = "submit"
                a.onclick = () => {
                    for (let obj = 1; obj < arr.length; obj++) {
                        if (arr[obj] === arr[arr.length - 1]) {
                            if (arr[obj].substring(arr[obj].length - 3, arr[obj].length) === '_id') {
                                values += '(SELECT ' + arr[obj].substring(0, arr[obj].length - 3) + 'id from ' + arr[obj].substring(0, arr[obj].length - 3) + ' WHERE ' + arr[obj].substring(0, arr[obj].length - 3) + 'id=\'' + document.getElementById(arr[obj]).value + '\'))'
                            } else if (parseInt(document.getElementById(arr[obj]).value) && arr[obj] !== "phone" && arr[obj].search('date') === -1 && arr[obj] !== "password" && arr[obj] !== "bin") {
                                values += document.getElementById(arr[obj]).value + ')'
                            } else if (document.getElementById(arr[obj]).value === '') {
                                values += '\'null\')'
                            } else {
                                values += '\'' + document.getElementById(arr[obj]).value + '\')'
                            }
                            reqest += arr[obj] + ')'
                        } else {
                            if (arr[obj].substring(arr[obj].length - 3, arr[obj].length) === '_id') {
                                values += '(SELECT ' + arr[obj].substring(0, arr[obj].length - 3) + 'id from ' + arr[obj].substring(0, arr[obj].length - 3) + ' WHERE ' + arr[obj].substring(0, arr[obj].length - 3) + 'id=\'' + document.getElementById(arr[obj]).value + '\'),'
                            } else if (parseInt(document.getElementById(arr[obj]).value) && arr[obj] !== "phone" && arr[obj].search('date') === -1 && arr[obj] !== "password" && arr[obj] !== "bin") {
                                values += document.getElementById(arr[obj]).value + ','
                            } else if (document.getElementById(arr[obj]).value === '') {
                                values += '\'null\','
                            } else {
                                values += '\'' + document.getElementById(arr[obj]).value + '\','
                            }
                            reqest += arr[obj] + ','
                        }
                    }
                    reqest += 'values (' + values
                    console.log(reqest)
                    let aa = DB.URL.concat(reqest);
                    console.log(aa)
                    deleteElement(table, id)
                    JSON.stringify(DB.sendRequest('GET', aa))
                    DB.createTable(table)
                }
                document.body.appendChild(a)
                let but3 = document.createElement('button');
                but3.innerHTML = "back"
                but3.onclick = () => {
                    document.body.innerHTML = DB.bodyDiv
                }
                document.body.appendChild(but3)
            }
        ))

}


const DB = new DatabaseSingleton()