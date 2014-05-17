var EventEmitter = require('events').EventEmitter;
var chokidar = require('chokidar');
var path = require('path');

function id(p) {
  return path.basename(p).replace(RegExp(path.extname(p) + '$'), '');
}

module.exports = function(seneca, opts, cb) {  
  var proto = seneca.make$('faux').__proto__;
  var folder = seneca.store.options.folder;
  proto.__proto__ = new EventEmitter;

console.log(folder);
  chokidar.watch(folder)
  	.on('add', function(p) {
      if (p === path.join(folder, 'seneca.txt')) {
        return;
      }
        console.log('k')

  		proto.emit('insert', id(p))
  	})
  	.on('unlink', function (p) {
  		proto.emit('remove', id(p))
  	})
  	.on('update', function(p) {
  		proto.emit('update', id(p))
  	})
  	.on('error', function(err) {
  		proto.emit('error', err)
  	});
}