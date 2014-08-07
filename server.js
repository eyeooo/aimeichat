/**
 * Created by Edison on 06-Aug-14.
 */
//var http = require('http');
//var server = http.createServer(function(req, res){
//        res.writeHead(200,{
//            'Content_Type' : 'text/html'
//        });
//        res.write('<h1>hello world</h1>');
//        res.end();
//    });
//server.listen(8080);

var express = require('express');

var app = express();

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

var users=[];

app.use('/', express.static(__dirname + '/www'));
server.listen(process.env.PORT || 3000);

io.sockets.on('connection',function(socket){
   socket.on('login',function(nickname){
       if(users.indexOf(nickname)>-1){
           socket.emit('nickExisted');
       }else{
           socket.userIndex = users.length;
           socket.nickname = nickname;
           users.push(nickname);
           socket.emit('loginSuccess');
           io.sockets.emit('system', nickname, users.length, 'login');
       }
   });

   socket.on('disconnect', function(){
      users.splice(socket.userIndex, 1);
      socket.broadcast.emit('system',socket.nickname, users.length, 'logout');
   });

   socket.on('postMsg',function(msg,color){
      socket.broadcast.emit('newMsg',socket.nickname, msg,color);
   });

   socket.on('img', function(imgData){
       socket.broadcast.emit('newImg', socket.nickname, imgData, color);
   });


});

console.log('server is running...');