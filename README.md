# awync-events
Awync way EventEmitter

## Installing
```
npm i awync-evets --save
```

## Usage

### Basic Usage

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


### Attaching to Others

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


## API

- EventEmitter.***when***
    > Waits until requested event is emitted. 
    Returns the passed parameters on emit call
    
     **If single argument is passed on emit;**
     
        If that argument is not an Error then it will be yielded without boxing.
     
        Otherwise, it will be thrown
    
     **If multiple arguments are passed on emit then**
     
        If first argument is error then it will be thrown and all passed arguments will be stored on firstArgument.args property.
     
        If arguments length is 2 and first argument is null or undefined then second argument will be yielded without boxing.
     
        Otherwise, all arguments will be yielded as array
        
        
    ```
        var eventResults = yield emitter.wait.someEvent();
    ```

- EventEmitter.***whichever(name1, name2,...nameN)***
    > Waits until one of requested event is emitted. 
    Returns an object with two parameters *{**name**, **args**}*
    
    ```
        awync(function*(){
            socket.connect();
            
            var eventResults = yield socket.whichever('error', 'connect');
            
            // eventResults.name == 'connect'
            // eventResults.args == []

            // Since the error on first parameter will be thrown,
            // This lines will be unreachable if 'error' event is emitted.
            // So, if below code is executed then we will be sure that 'connect' event is emitted.
            console.log('Connected!');
        });
    ```


- EventEmitter.***whatever()***
    > Waits until any event is emitted.
    Returns an object with two parameters *{**name**, **args**}*
    
    ```
        awync(function*(){
            
            while(true){
                var result = yield emitter.whatever();
                console.log("Event %s is emitted with args: %s", result.name, result.args);
            }

        });
        
        setInterval(function(){
            emitter.emit('some random event name ' + Math.random(), Date.now());
        }, 1000);
    ```

## Change Log
- 1.1.0 whatever(), whichever() API functions are added
- 1.0.0 Initial Release
