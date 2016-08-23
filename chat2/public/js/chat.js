 	  var socket = socketCluster.connect();
 	  

      socket.on('error', function (err) {
        throw 'Socket error - ' + err; 
      });

      socket.on('connect', function () {
        console.log('Connected to server');
      });
      
      socket.on('yell',function(data){ 
    		$('#messages-list').append($('<li>').text(data));
  	  });

      $('form').submit(function(){
        if($('#message').val() != '') {
          socket.emit('chat', $('#message').val());
        } 

      $('#message').val('')
        return false;
		});

