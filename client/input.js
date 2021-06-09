(function(exports) {
/**
 * Desktop input handler (ie. mouse, keyboard)
 */

function DesktopInput(game) {
  this.game = game;
  var ctx = this;
  var cameraDelta = 1;
  // Listen for mouse events on the canvas element
  var canvas = document.getElementById('canvas');
  canvas.addEventListener('click', function(e) {
    _gaq.push(['_trackEvent', 'Shoot']);
    ctx.onclick.call(ctx, e);
  });

  canvas.onmousemove = function(event) {
    // Get the position of the click.
    cx = event.clientX - event.target.getBoundingClientRect().left;
    cy = event.clientY - event.target.getBoundingClientRect().top;
    // Get the current player.
    player = ctx.game.state.objects[playerId];
    // Sometimes the player isn't there.
    if (!player) {
      return;
    }
    // Consider where the player is positioned.
    px = player.x;
    py = player.y;
    //console.log(px + ":" + py);
    // Get the angle of the shot
    angle = Math.atan2(cy - py, cx - px);
    // Send the corresponding shoot() command.
    socket.emit('godirection', { direction: angle });
    
  }
  
  document.addEventListener('keydown', function(evt) {
    // Get the current player.
    console.log(ctx);
    var player = ctx.game.state.objects[playerId];

    // Sometimes the player isn't there.
    if (!player) {
      return;
    }
    // Consider where the player is positioned.
    var px = player.x;
    var py = player.y;


    switch(evt.keyCode) {
      case 37: // left
        // console.log(px + ":" + py);
        player.x -= cameraDelta;
        break;
      case 38: // up
        // console.log('up');
        player.y -= cameraDelta;
        break;
      case 39: // right
        // console.log('right');
        player.x += cameraDelta;
        break;
      case 40: // down
        // console.log('down');
        player.y += cameraDelta;
        break;
    }
  });

  // Bind to the join button
  var join = document.getElementById('join');
  join.addEventListener('click', function(e) {
    _gaq.push(['_trackEvent', 'Join']);
    ctx.onjoin.call(ctx, e);
  });

  // Bind to music button.
  var music = document.getElementById('music');
  music.addEventListener('click', function(e) {
    _gaq.push(['_trackEvent', 'Toggle Music']);
    ctx.onmusic.call(ctx, e);
  });
}

DesktopInput.prototype.onjoin = function() {
  if (!playerId) {
    smoke.prompt("what is your name", function(name) {
      if (name) {
        socket.emit('join', {name: name});
        document.querySelector('#join').style.display = 'none';
      } else {
        smoke.signal('sorry, name required');
      }
    });
  }
};

DesktopInput.prototype.onmusic = function() {
  sound.toggleSoundtrack();
};

DesktopInput.prototype.onleave = function() {
  socket.emit('leave', {name: playerId});
};

DesktopInput.prototype.onclick = function(event) {
  // Get the position of the click.
  var cx = event.clientX - event.target.getBoundingClientRect().left;
  var cy = event.clientY - event.target.getBoundingClientRect().top;
  // Get the current player.
  var player = this.game.state.objects[playerId];
  // Sometimes the player isn't there.
  if (!player) {
    return;
  }
  // Consider where the player is positioned.
  var px = player.x;
  var py = player.y;
  // Get the angle of the shot
  var angle = Math.atan2(cy - py, cx - px);
  // Send the corresponding shoot() command.
  socket.emit('shoot', { direction: angle });
};

DesktopInput.prototype.onmousemove = function(event) {
  // Get the position of the click.
  var cx = event.clientX - event.target.getBoundingClientRect().left;
  var cy = event.clientY - event.target.getBoundingClientRect().top;
  // Get the current player.
  var player = this.game.state.objects[playerId];
  // Sometimes the player isn't there.
  if (!player) {
    return;
  }
  // Consider where the player is positioned.
  var px = player.x;
  var py = player.y;
  console.log(px + ":" + py);
  // Get the angle of the shot
  var angle = Math.atan2(cy - py, cx - px);
  // Send the corresponding shoot() command.
  socket.emit('godirection', { direction: angle });
};

exports.Input = DesktopInput;

})(window);
