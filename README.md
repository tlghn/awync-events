# awync-events
Awync way EventEmitter

#### Basic Usage

```
const EventEmitter = require('awync-events');
const awync = require('awync');
const ee = new EventEmitter();

awync(function*(){
    var result = yield ee.when.test();
    console.log(result);
    // output: Easy events
});

setTimeout(function(){
    ee.emit('test', 'Easy events');
}, 1000);

```


#### Attaching to Others

```
const EE = require('awync-events');
const awync = require('awync');
const net = require('net');
const server = new net.Server();
EE(server);

awync(function*(){
    server.listen(3000);
    
    yield server.when.listening();
    console.log('Listening');
});

```