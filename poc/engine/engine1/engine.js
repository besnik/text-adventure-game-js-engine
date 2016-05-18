// MODEL

var Player = function(locationId) {
    this.locationId = locationId;
}

var Link = function(id, text) {
    this.id = id;               // location id
    this.text = text;           // description for UI where player can go
}

var Location = function() {
   this.id = "";                // unique id of location
   this.text = "";              // long description of location
   this.title = "";             // Short title of location
   this.links = [];             // array of links (locations) where player can move from this location
}

var Locations = function(items) {
    for (var i in items) {
        var item = items[i];
        this[item.id] = item;
    }
}

var Game = function(player, locations) {
    this.player = player;
    this.locations = locations;
    
    this.go = function(locationId) {
        this.player.locationId = locationId;
    }
    
    this.location = function() {
        return this.locations[this.player.locationId];    
    }
}

