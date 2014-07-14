var EventEmitter = require('events').EventEmitter;
var chokidar = require('chokidar');
var path = require('path');

function data(p) {
  var base = path.basename(p);
  var segs = p.split('/');

  return {
    id: base.replace(RegExp(path.extname(p) + '$'), ''),
    name: segs[segs.length-2]
  }

}

function ignore(p) {
  var base = path.basename(p);
  return base[0] === '.' 
    || /DELETE/.test(base) 
    || base === 'seneca.txt';
}

module.exports = function(seneca, opts, cb) {  
  var proto = seneca.make$('faux').__proto__;
  var senopts = seneca.options();
  if (!senopts['jsonfile-store']) {
    throw Error('jsonfile-store must be included before jsonfile-store-watcher');
  }
  var folder = senopts['jsonfile-store'].folder;
  proto.__proto__ = new EventEmitter;
    
  chokidar.watch(folder, {ignored: ignore})
  	.on('add', function(p) {
  		proto.emit('insert', data(p))
  	})
  	.on('unlink', function (p) {
  		proto.emit('remove', data(p))
  	})
  	.on('change', function(p, d) {
  		proto.emit('update', data(p))
  	})
  	.on('error', function(err) {
  		proto.emit('error', err)
  	});
}