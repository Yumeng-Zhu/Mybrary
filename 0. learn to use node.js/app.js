const http = require('http')
const fs = require('fs') //manage the file, including html
const port = 3000

const server = http.createServer(function(req,res){
    res.writeHead(200, {'Content-Type': 'text/html'})
    fs.readFile('index.html', function(error,data){
        if (error){
            res.writeHead(404)
            res.write('Error: File not found')
        } else{
            res.write(data) //show the index.html file
        }
        res.end()
    })
    // res.write("hello node") write somehing in the terminal when requested

})

server.listen(port, function(error){
    if(error){
        console.log('sth went wrong',error)
    }else{
        console.log('server is listening on the port ' + port)
    }
})