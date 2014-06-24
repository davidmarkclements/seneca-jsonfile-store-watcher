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

function wait(time, cb) {
  setTimeout(cb, time);
}

suite('augmentation')
test('should convert entities to EventEmitters', function (done) {
 entity.should.be.an.instanceof(require('events').EventEmitter);
 done();
})

suite('insert')

test('should emit insert when new record created', function (done) {
  this.timeout(3000)

  //just listen once for insert, 
  //as we'll be adding at other points too
  entity.once('insert', function(data) {
    data.should.be.an.object;
    data.id.should.equal('test1');
    data.name.should.equal('test');
    done();
  })

  setTimeout(function () {
    entity.make$({id$:'test1'}).save$()  
  }, 2500)
  

})


suite('update')
test('should emit update when a record is updated', function (done) {
  this.timeout(10000);

  setTimeout(function () {

    entity.on('update', function(data) {
      data.should.be.an.object;
      data.id.should.equal('test2');
      data.name.should.equal('test');
      done();
    })

    entity.make$({id$:'test2'}).save$(function(err, rec) {
      should.equal(err, null);
      rec.newProp = 'newprop';
      setTimeout(function() {
        rec.save$();
      }, 2000)
      

    })

  }, 1000)

})


suite('remove')

test('should emit remove when a record is removed', function (done) {
  this.timeout(5000);

  entity.on('remove', function(data) {
    data.should.be.an.object;
    data.id.should.equal('test3');
    data.name.should.equal('test');
    done();
  })



  entity.make$({id$:'test3'}).save$(function(err, rec) {
    should.equal(err, null);

    //give time for io and polling
    setTimeout(function () {
      entity.remove$('test3');
    }, 2500);
    
  })


})

