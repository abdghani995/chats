var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var redis = require("redis");

var pub = redis.createClient();
var sub = redis.createClient();


sub.on("subscribe", function(channel, count) {
    console.log("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
});



sub.subscribe("analytics");




module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);

  var app = require('express')();
  var httpServer = worker.httpServer;
  var scServer = worker.scServer;
  app.use(serveStatic(path.resolve(__dirname, 'public')));
  httpServer.on('request', app);
  var count = 0;

  scServer.on('connection', function (socket) {
    console.log("user Connected")

    socket.on('chat', function (data) {
      console.log('Chat:', data);
      pub.publish("analytics", data);
    });

    sub.on("message", function(channel, message) {
      scServer.global.publish('yell', message);
    });    

    var interval = setInterval(function () {
      socket.emit('rand', {
        rand: Math.floor(Math.random() * 5)
      });
    }, 1000);
    
    socket.on('disconnect', function () {
      console.log("user disconnected")
      clearInterval(interval);
    });

  });
};
