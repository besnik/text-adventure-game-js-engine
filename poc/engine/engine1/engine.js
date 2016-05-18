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

var Locations = function(locations) {
    for (var i in locations) {
        var l = locations[i];
        this[l.id] = l;
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


var Parser = function() {
    
    // returns array of Location type from given json input
    this.toLocations = function(json) {
    
        var locations = [];
    
        for (var i in json) {
            var locationJson = json[i];
            
            // create model from input level definition json
            var l = new Location();
            
            l.id = locationJson.id;
            l.text = locationJson.text;
            l.title = locationJson.title;
            
            l.links = [];
            for (var i in locationJson.links) {
                var linkJson = locationJson.links[i];
                l.links.push(new Link(linkJson.id, linkJson.text));
            }
            
            // set as property of locations object        
            locations.push(l);
        }   
        
        return locations;
    
    }
    
}

