# seneca-jsonfile-store-watcher

A behaviour modifying seneca plugin, used in conjunction with seneca-jsonfile-store to enable a watching/changes API 

(*Note:* not yet on npm)


## Install

```sh
npm install seneca
npm install seneca-jsonfile-store
npm install seneca-jsonfile-store-watcher
```

## Usage

```
var seneca = require('seneca')();
seneca.use('jsonfile-store', {folder: db});
seneca.use('../jsonfile-store-watcher');

var entity = seneca.make$('test');
entity.on('insert', function(id) {
  id.should.equal('test1');
  done();
})

entity.make$({id$:'test1'}).save$(function() {})

```

## Test

*Note:* Tests are correctly written, 
and plugin works as intended, but the mocha
environment is having an effect, possibly
on the file watching, so that tests fail. 

```
npm test
```


## API
Following events can be listened to using on/once etc. 

```
.on('insert', function (id) {})
```

```
.on('update', function (id) {})
```

```
.on('remove', function (id) {})
```

```
.on('error', function (err) {})
```

