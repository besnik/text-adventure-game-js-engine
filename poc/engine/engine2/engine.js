// Text Adventure Game and Editor Engines

// Editor engine
// Use editor engine and its API to setup or edit game
var Editor = function() {
    // holds game engine
    this.game = null;
    // initializes empty new game engine
    this.new_game = function() { this.game = new Engine(); return this; }
    // factories that helps creating configuration
    this.factory = {
        location: new LocationFactory()
    }
    // loads game configuration from json file
    this.load_game = function(json) {}
    // returns game engine object ready to be played
    this.start_game = function() { this.game.see(); return this.game; }
    // specifies event 
    this.when = function(event_type, params) {}
    // specifies action for an event
    this.do = function(operation, params) {}
    // adds location to the game engine
    this.add_location = function(l) { this.game.locations.add(l); return this; }
    // sets player location
    this.set_player_location = function(location_id) { this.game.player.location_id = location_id; return this; }
    // adds event listener to game engine
    this.add_listener = function(event_name, event_handler) { this.game.events.subscribe(event_name, event_handler); return this; }
    // when player goes to a location
    this.when_location_changed_to = function(location_id) {
        var action = new EditorAction(this, "location_changed");
        action.location_id = location_id;
        return action;
    }
}

// Editor's actions to subscribe function for events in game engine
var EditorAction = function(editor, event_type) {
    this.editor = editor;
    this.event_type = event_type;

    this.change_location_state = function(location_id, new_state) {
        // subscribe to this.editor.game.events
        return this.editor;
    }
}

// Game engine
// Use game engine to play game using available APIs
var Engine = function() {
    // state of player
    this.player = new Player();
    // locations with state
    this.locations = new LocationRepository();
    // events engine
    this.events = new PubSub();
    // get current location
    this.location = function() { return this.locations.get(this.player.location_id); }
    // print what you see in current location
    this.see = function() {
        // fire event to update UI  
        var data = this.publish.update_ui({ engine: this });
        return this;
    }
    // go to specific location
    this.go = function(location_id) {
        // change location of player
        this.player.location_id = location_id;
        // fire event location changed
        this.publish.location_changed({ engine: this });
        return this;
    }
    // handlers
    this.handle_location_changed = function(data) {
        new_location_id = data.engine.player.location_id;

        // read conditions->actions map

        // if all conditions ok, execute action

    }
    // helper methods for publishing events
    // IMPORTANT: func definition overrides "this" keyword. call engine using data.engine
    this.publish = {
        update_ui: function(data) { data.engine.events.publish("update_ui", data); },
        location_changed: function(data) { data.engine.events.publish("location_changed", data); }
    }
}

// Location
var Location = function() {
    // unique ID of location
    this.id = "default";
    // state of location
    this.state = "default";
    // texts for each location state (dict state->text)
    this.texts = {}
    this.texts[this.state] = "default text for location in default state";
    // gets text for current location state
    this.get_text = function() { return this.texts[this.state]; }
    // adds text for defined state
    this.set_text = function(state, text) { this.texts[state] = text; }
    // links to other locations (array of links)
    this.links = [];
    // adds link to location
    this.add_link = function(l) { this.links.push(l); }
    // removes link from location
    this.remove_link = function(l) {
        var index = array.indexOf(5);
        if (index > -1) { array.splice(index, 1); }
    }
}

// Factory to help with Location instance initialization
var LocationFactory = function() {
    // stores location
    this.l = null;
    // sets location instance
    this.new = function() { this.l = new Location(); return this; }
    this.for = function(location) { this.l = location; return this; }
    this.id = function(location_id) { this.l.id = location_id; return this; }
    // sets state of location
    this.state = function(location_state) { this.l.state = location_state; return this; }
    // adds text to the location for given state
    this.set_text = function(location_state, location_text) { this.l.set_text(location_state, location_text); return this; }
    // adds link to the location
    this.add_link = function(target_id, text, state) { 
        var link = new Link();
        link.target_id = target_id;
        link.text = text;
        if (typeof state != undefined) { link.state = state; }
        this.l.add_link(link);
        return this;
    }
    // gets Location instance with configured data
    this.build = function() { return this.l; }
}

// Link to other Locations
var Link = function() {
    // target location id
    this.target_id = "default";
    // text of link that will be displayed to user where we can go from current loc
    this.text = "default link text";
    // state of link (could be e.g. disabled)
    this.state = "default";
}

// Player and his state
var Player = function() {
    this.location_id = "default";
}

// Repository stores and manages Locations
var LocationRepository = function() {
    // internal dictionary of locations
    this.locations = {}
    // adds location to repository
    this.add = function(l) { this.locations[l.id] = l; }
    // removes location from repository
    this.remove = function(l) { delete this.locations[l.id]; }
    // gets location from repository
    this.get = function(id) { return this.locations[id]; }
}

// Publish-Subscribe engine
var PubSub = function() {
    // array of events. every event contains array of subscribed functions
    this.events = {};
    // subscribes listener for given event
    this.subscribe = function(e, listener) {
        if (typeof e != "string") { throw new Error("ArgumentException: e. Expecting string. Actual value " + e); }
        if (typeof listener != "function") { throw new Error("ArgumentException: listener. Expecting function. Actual value " + listener); }
        // store listeners in array
        if (this.events[e] == undefined) { this.events[e] = []; }
        // add listener to array
        this.events[e].push(listener);
    }
    // calls all subscribed listeners for the event with given data
    this.publish = function(e, data) {
        if (typeof e != "string") { throw new Error("ArgumentException: e. Expecting string. Actual value " + e); }
        // quit if there are no subscribers
        if (this.events[e] == undefined) { return; }
        // call all subscribers
        for (var i in this.events[e]) {
            // IMPORTANT: function will be executed under context of caller! this means context of "this" keyword will change
            this.events[e][i](data);
        }
    }
}

