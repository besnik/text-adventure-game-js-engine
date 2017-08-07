# Publish Subscribe

```

// Implementation of publisher-subscriber pattern
var PubSub = function() {
    
    // array of events. every event contains array of subscribed functions
    this.events = {};
    
    // adds function to event
    // important: function will be executed under context of caller! this means context of "this" keyword will change
    this.subscribe = function(e, listener) {
        if (typeof e != "string") { throw new Error("ArgumentException: e. Expecting string. Actual value " + e); }
        if (typeof listener != "function") { throw new Error("ArgumentException: listener. Expecting function. Actual value " + listener); }
        
        if (this.events[e] == undefined) { 
            this.events[e] = [];
        }
        
        this.events[e].push(listener);
    }
    
    // calls functions subscribed for event with given data
    this.publish = function(e, data) {
        if (typeof e != "string") { throw new Error("ArgumentException: e. Expecting string. Actual value " + e); }
        
        if (this.events[e] == undefined) { 
            return;
        }
        
        for (var i in this.events[e]) {
            this.events[e][i](data);
        }
    }
    
}

// testing

function writeln(data) { document.write(data); }

var p = new PubSub();
p.subscribe("test", writeln);
p.subscribe("test", writeln);
p.publish("test", "hello world");

```