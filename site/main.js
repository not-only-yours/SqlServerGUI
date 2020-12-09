var URL = "http://localhost:9000?test="
var from = 0;
var bodyDiv = document.body.innerHTML;
function sendRequest(method, url, body = null) {
    return fetch(url).then(response => {
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




function createTable(table) {
    from = 0;
    var str = URL.concat("select * from " + table)
    //console.log(str)
    console.log(str)
    createTableByUrl(str, table)
}

function createTableByUrl(urlInput,table){
    JSON.stringify(sendRequest('GET', urlInput)
        .then(data => {
            var arr = Object.keys(data[0])
            //console.log(arr)
            var arrOfTh = ""
            for(obj in arr){
                arrOfTh +='        <th>' + arr[obj] +'</th>\n'
            }

            document.body.innerHTML = '<table class="table table-striped">\n' +
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

            var tableq = document.getElementById('myTable')

            for (var i = from; i < 10 + from; i++) {
                if(data[i]) {
                    var row = '<tr>'
                    for(obj in arr) {
                        if (arr[obj] === 'birthdate' || arr[obj] === 'hiredate' || arr[obj] === 'loandate') {
                            row += '<td>' + data[i][arr[obj]].substring(0, 10) + '</td>'
                        } else
                            row += '<td>' + data[i][arr[obj]] + '</td>'
                    }
                    row += '<td><button id = "D' + data[i][arr[0]] +'" onclick = deleteElement("customer",this.id) >delete</button></td>'
                    row += '<td><button id = "E' + data[i][arr[0]] +'" onclick = editElement("customer",this.id) >edit</button></td>'
                    row +=  '</tr>'
                    //console.log(row)
                    tableq.innerHTML += row
                }
                //console.log(data)
            }
            createNavigateButton(urlInput,table)
        }))

}

function addtoTable(table) {
    var str = URL.concat("select * from "+table)
    JSON.stringify(sendRequest('GET', str)
        .then(data => {
            var arr = Object.keys(data[0])
            console.log(arr)
            document.body.innerHTML = ""
            for(obj=1;obj<arr.length;obj++){
                document.body.innerHTML  +='<input id="'+ arr[obj]+ '"placeholder="'+ arr[obj] +'"></input>';
            }
            var reqest = 'INSERT INTO '+table+'('
            var values = ''

            var a = document.createElement('button')
            a.innerHTML = "submit"
            a.onclick = () => {
                for(obj=1;obj<arr.length;obj++){
                    if(arr[obj] === arr[arr.length-1]){
                        if(arr[obj].substring(arr[obj].length-3, arr[obj].length) === '_id'){
                            values+= '(SELECT '+ arr[obj].substring(0,arr[obj].length-3)+ 'id from '+arr[obj].substring(0,arr[obj].length-3)+' WHERE '+arr[obj].substring(0,arr[obj].length-3)+'id=\''+ document.getElementById(arr[obj]).value + '\'))'
                        }
                    else if(parseInt(document.getElementById(arr[obj]).value) && arr[obj]!=="phone" && arr[obj].search('date') === -1 && arr[obj]!=="password" && arr[obj]!=="bin"){
                        values+=document.getElementById(arr[obj]).value+')'
                    }else if(document.getElementById(arr[obj]).value === ''){
                        values+='\'null\')'
                    }else{
                        values+='\'' + document.getElementById(arr[obj]).value+'\')'
                    }
                    reqest+=arr[obj]+')'
                }else {
                    if(arr[obj].substring(arr[obj].length-3, arr[obj].length) === '_id'){
                        values+= '(SELECT '+ arr[obj].substring(0,arr[obj].length-3)+ 'id from '+arr[obj].substring(0,arr[obj].length-3)+' WHERE '+arr[obj].substring(0,arr[obj].length-3)+'id=\''+ document.getElementById(arr[obj]).value + '\'),'
                    }
                        else if(parseInt(document.getElementById(arr[obj]).value) && arr[obj]!=="phone" && arr[obj].search('date') === -1 && arr[obj]!=="password" && arr[obj]!=="bin"){
                        values+=document.getElementById(arr[obj]).value+','
                    }else if(document.getElementById(arr[obj]).value === ''){
                        values+='\'null\','
                    }else{
                        values+='\'' + document.getElementById(arr[obj]).value+'\','
                    }
                    reqest += arr[obj] + ','
                }
            }
            reqest += 'values (' + values
            console.log(reqest)
                var aa = URL.concat(reqest)
                console.log(aa)
                JSON.stringify(sendRequest('GET', aa))
                    createTable(table)
            }
            document.body.appendChild(a)
                var but3 = document.createElement('button')
                but3.innerHTML = "back"
                but3.onclick = () => {
                    document.body.innerHTML = bodyDiv
                }
            document.body.appendChild(but3)
        }
        ))

}

function deleteElement(table , id){
    console.log(id)
    var str = URL.concat("delete from " + table+" where "+table+"id = "+ id.substring(1))
    console.log(str)
    JSON.stringify(sendRequest('GET', str)
        .then(() => createTable(table)))

}


function editElement(table , id){
    console.log(table + " " + id)

}




function createNavigateButton(link, table){
    //console.log('yaTut')
    var but1 = document.createElement('button')
    but1.id = "plusTen"
    but1.innerHTML = "prev"
    var but2 = document.createElement('button')
    but2.id = "minusTen"
    but2.innerHTML = "next"
    var but3 = document.createElement('button')
    but3.innerHTML = "back"
    but3.onclick = () => {
        document.body.innerHTML = bodyDiv
    }
    document.body.appendChild(but1)
    document.body.appendChild(but2)
    document.body.appendChild(but3)
    document.getElementById('plusTen').onclick = () => {
        if(from>0) {
            from -= 10
            document.body.innerHTML = ""
            createTableByUrl(link, table)
        }
    }
    document.getElementById('minusTen').onclick = () => {
        from += 10
        document.body.innerHTML = ""
        createTableByUrl(link, table)
    }
}


function selectWithFilter(table, what){
    from = 0;
    var str = URL.concat("select * from "+table + " where " + what)
    console.log(str)
    createTableByUrl(str, table)
}