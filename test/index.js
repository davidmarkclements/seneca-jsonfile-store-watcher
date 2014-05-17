var should = require('chai').should();

var fs = require('fs');
var path = require('path');
var db = path.join(__dirname, 'db');

if (fs.existsSync(db)) {
  require('rimraf').sync(db);
}

fs.mkdirSync(db);

var seneca = require('seneca')();
seneca.use('jsonfile-store', {folder: db});
seneca.use('../jsonfile-store-watcher');

var entity = seneca.make$('test');

suite('augmentation')

test('should convert entities to EventEmitters', function () {
	entity.should.be.an.instanceof(require('events').EventEmitter);
})

suite('insert')

test('should emit insert when new record created', function (done) {
  
  entity.on('insert', function(id) {
    id.should.equal('test1');
    done();
  })

  entity.make$({id$:'test1'}).save$(function() {})

})

suite('update')

test('should emit update when a record is updated', function (done) {
  
  entity.on('update', function(id) {
    id.should.equal('test2');
    done();
  })

  entity.make$({id$:'test2'}).save$(function(err, rec) {
    should.equal(err, null);
    rec.newProp = 'newprop';
    rec.save$(function(){});

  })

})

suite('remove')

test('should emit remove when a record is removed', function (done) {
  
  entity.on('remove', function(id) {
    id.should.equal('test3');
    done();
  })

  entity.make$({id$:'test3'}).save$(function(err, rec) {
    should.equal(err, null);
    entity.remove$('test3',function(){});
  })

})
