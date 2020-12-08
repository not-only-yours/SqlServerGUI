var URL = "http://localhost:9000?test=select * from customers"
var from = 0;
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




function customerCreate() {
    JSON.stringify(sendRequest('GET', URL)
        .then(data => {
            document.body.innerHTML = '<table class="table table-striped">\n' +
                '    <tr  class="bg-info">\n' +
                '        <th>CustomerID</th>\n' +
                '        <th>CompanyName</th>\n' +
                '        <th>ContactName</th>\n' +
                '        <th>ContactTitle</th>\n' +
                '        <th>Address</th>\n' +
                '        <th>City</th>\n' +
                '        <th>Region</th>\n' +
                '        <th>PostalCode</th>\n' +
                '        <th>Country</th>\n' +
                '        <th>Phone</th>\n' +
                '        <th>Fax</th>\n' +
                '    </tr>\n' +
                '\n' +
                '    <tbody id="myTable">\n' +
                '        \n' +
                '    </tbody>\n' +
                '</table>'

            var table = document.getElementById('myTable')

            for (var i = from; i < 10 + from; i++) {
                if(data[i]) {
                    var row = `<tr>
							<td>${data[i].CustomerID}</td>
							<td>${data[i].CompanyName}</td>
							<td>${data[i].ContactName}</td>
							<td>${data[i].ContactTitle}</td>
							<td>${data[i].Address}</td>
							<td>${data[i].City}</td>
							<td>${data[i].Region}</td>
							<td>${data[i].PostalCode}</td>
							<td>${data[i].Country}</td>
							<td>${data[i].Phone}</td>
							<td>${data[i].Fax}</td>
					  </tr>`
                    table.innerHTML += row
                }
                //console.log(data)
            }
            var but1 = document.createElement('button')
            but1.id = "plusTen"
            but1.innerHTML = "prev"
            var but2 = document.createElement('button')
            but2.id = "minusTen"
            but2.innerHTML = "next"
            document.body.appendChild(but1)
            document.body.appendChild(but2)
            document.getElementById('plusTen').onclick = () => {
                if(from>0) {
                    from -= 10
                    document.body.innerHTML = ""
                    customerCreate()
                }
            }
            document.getElementById('minusTen').onclick = () => {
                from += 10
                document.body.innerHTML = ""
                customerCreate()
            }
}))
}
