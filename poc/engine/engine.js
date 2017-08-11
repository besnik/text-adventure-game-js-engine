// Text Adventure Game and Editor Engines

// Editor engine
// Use editor engine and its API to setup or edit game
export const Editor = function(json_data) {
    this.json_data = json_data
    // holds game engine
    this.game = null;
    // initializes empty new game engine
    this.new_game = function() { this.game = new Engine(); return this; }
    // factories that helps creating configuration
    this.factory = { location: new LocationFactory() }
    // converts game engine into json text
    this.to_json = function() { return new EngineSerializer().to_json(this.game); }
    // loads game configuration from json file
    this.from_json = function() { this.game = new EngineSerializer().from_json(this.json_data); return this; }
    // returns game engine object ready to be played
    this.start_game = function() { this.game.see(); return this.game; }
    // adds location to the game engine
    this.add_location = function(l) { this.game.locations.add(l); return this; }
    // sets player location
    this.set_player_location = function(location_id) { this.game.player.location_id = location_id; return this; }
    // adds event listener to game engine
    this.add_listener = function(event_name, event_handler) { this.game.events.subscribe(event_name, event_handler); return this; }
    // when player goes to a location
    this.when_location_changed_to = function(location_id) {
        return new ActionSelector(this, "location_changed", new LocationCondition(location_id));
    }
}

// Binds conditions and actions together
 var ActionSelector = function(editor, event_type, condition) {
    this.editor = editor;
    this.event_type = event_type;
    this.condition = condition;

    this.set_state_of_location = function(location_id, new_state) {
        // couple condition and action as single entity
        var action = new SetLocationStateAction({location_id: location_id, new_state: new_state}, false);
        // wrap conditions and actions together for the event type
        var ac = new EventHandler(this.event_type);
        // add condition and action
        ac.add(this.condition, action);
        // store action container in engine
        this.editor.game.event_handlers.add(ac);
        // back to editor to allow fluent interface
        return this.editor;
    }
}

// Converts game engine to/from json
var EngineSerializer = function() {
    // serializes model to json data
    this.to_json = function(engine) {
        var model = { 
            name: "Text Adventure Game Configuration", 
            version: "1.0",
            locations: engine.locations.all(),
            player: engine.player,
            actions: engine.actions // convert to model, add name automatically and remove private variables (by providing custom function to JSON.stringify and _ to private fields)
        }

        return JSON.stringify(model, null, 2);
    }

    // todo: refactor to condition_factory so there is single method to instantiate conditions
    // parses model from json into Condtion model
    this.condition_parser = {};
    this.condition_parser["LocationCondition"] = function(c) { return new LocationCondition(c.location_id); }

    // todo: refactor to action_factory so there is single method to instantiate action
    // parses model from json into Action model
    this.action_parser = {}
    this.action_parser["SetLocationStateAction"] = function(a) { return new SetLocationStateAction(a.location_id, a.new_state, a.repeat) }

    // deserializes game engine from json data
    this.from_json = function(json_data) {
        // parse json string
        var model = json_data
        // use editor instance to reconstruct game engine using data from json
        var editor = new Editor();
        // set single values
        editor.new_game().set_player_location(model.player.location_id);
        // set locations
        for(var key in model.locations) {
            // get location settings from json
            var location_settings = model.locations[key];
            // set single values
            var lf = editor.factory.location
                .new()
                .id(key)
                .set_state(location_settings.state);

            lf.set_criteria(location_settings.criteria);
            // set texts for states
            for (var state in location_settings.texts) { lf.set_text(state, location_settings.texts[state]); }
            
            lf.set_links(location_settings.links)
            // set links - Old Way when it was a list
            // for (var j=0; j<location_settings.links.length; j++) {
            //     var link_settings = location_settings.links[j];
            //     lf.add_link(link_settings.target_id, link_settings.text, link_settings.state);
            // }
            // location set, build
            var l = lf.build();
            // add to location repository
            editor.add_location(l);
        }
        // set actions
        /*for (var i=0; i<model.actions.length; i++) {
            // get settings from parsed json
            var action_settings = model.actions[i];
            // reconstruct condition
            var condition = this.condition_parser[action_settings.condition.name](action_settings.condition);
            // reconstruct action
            var action = this.action_parser[action_settings.name](action_settings, c);

            // todo: subscribe for event (need instance of editor/game engine)
            // where is good place to store event_type? condition, action, separated?-.for(event).when().do()
        }*/


        return editor.start_game();
    }
}

// Game engine
// Use game engine to play game using available APIs
var Engine = function(gameJSON) {
    // state of player
    this.player = new Player();
    // locations with state
    this.locations = new LocationRepository();
    // events engine
    this.events = new PubSub();
    // actions to be executed in case of event
    this.event_handlers = new EventHandlers();
    // subscribe to get all events after subscribed event handlers were executed;
    this.events.event_published_callback = function(e, data) { data.engine.event_handlers.execute(e, data.engine); }
    // get current location
    this.location = function() { return this.locations.get(this.player.location_id); }
    // print what you see in current location
    this.see = function() {
        // fire event to update UI  
        var data = this.publish.update_ui({ engine: this });
        return this;
    }

    this.evaluate_criteria = (evalfunc, interaction, criteria) => {
        for (let key in criteria) {
            const success = evalfunc(interaction, criteria[key])
            if (success) {
                return key
            }
        }
        return "fail"
    }

    // Evaluate text input
    this.interact = (interaction) => {
        const loc =  this.locations.get(this.player.location_id)
        // This just a demo eval function to check for keywords in a list
        const evalfunc = (interaction, keywordList) => { if (keywordList.indexOf(interaction) >= 0) return true }
        const nextKey = this.evaluate_criteria(evalfunc, interaction, loc.criteria)
        this.go(loc.links[nextKey].target_id)
        return loc
    }

    // go to specific location
    this.go = function(location_id) {
        // change location of player
        this.player.location_id = location_id;
        // fire event location changed
        this.publish.location_changed({ engine: this });
        return this;
    }
    // helper methods for publishing events
    // IMPORTANT: func definition overrides "this" keyword. call engine using data.engine
    this.publish = {
        update_ui: function(data) { data.engine.events.publish("update_ui", data); },
        location_changed: function(data) { data.engine.events.publish("location_changed", data); }
    }
}

// stores all action containers (actions (event handlers) for specified event) categorized by event_type
var EventHandlers = function() {
    // dict. key: event_type, value: array of EventHandler
    this.items = {}
    // adds action container into list
    this.add = function(ac) {
        // lazily create array of action containers
        if (this.items[ac.event_type] == undefined) { this.items[ac.event_type] = []; }
        // add action container into list
        this.items[ac.event_type].push(ac);
    }

    // removes action container from list
    this.remove = function(ac) {
        if (this.items[ac.event_type] == undefined) { return; }
        this.items[ac.event_type].find(function(e,i,a) {
            if (e == ac) { a.splice(i, 1); return true; }
        });
    }

    // execute all registered action containers for given event
    this.execute = function(event_type, engine) {
        if (typeof event_type != "string") { throw new Error("ArgumentException: event_type. Expecting string. Actual value " + e); }
        if (typeof engine != "object") { throw new Error("ArgumentException: engine. Did you specify engine in data when firing event? Expecting object. Actual value " + listener); }

        // see if there is any action cotainer registered for the event
        if (this.items[event_type] == undefined) { return; }
        // execute
        this.items[event_type].forEach(function(ac) { ac.execute(engine); });
    }
}

// Holds for an event the conditions that must be true and actions that will be executed
var EventHandler = function(event_type) {
    // type of event for which the list of actions is relevant
    this.event_type = event_type;
    // conditions that all (AND) must be met
    this.conditions = [];
    // actions that will be executed
    this.actions = [];
    // adds condition to the container
    this.add_condition = function(c) { if (typeof c == "object") { this.conditions.push(c); } }
    // adds action to the container
    this.add_action = function(a) { if (typeof a == "object") { this.actions.push(a); } }
    // adds condition and action to the container
    this.add = function(c, a) { this.add_condition(c); this.add_action(a); }
    // validate and execute actions
    this.execute = function(engine) {
        // if not all conditions are valid => don't execute actions
        if (!this.conditions.every(function(c) { return c.is_valid(engine); })) return;
        // execute all actions
        this.actions.forEach(function(a) { a.execute(engine); });
    }
}

// todo: refactor to dictionary and anonymous func like condition_parser?
// condition that checks if player entered (is already on) specific location
var LocationCondition = function(location_id) {
    // name of type. used for json serialization
    this.className = this.constructor.name;
    // id of location where player must be located so the condition is true
    this.location_id = location_id;
    // validates state of model
    this.is_valid = function(engine) { return engine.player.location_id === this.location_id; }
}

// creates logical condition with injected validation logic
var CreateLogicalConditionClass = function(className, is_valid_func) {

    // using closure returns function with injected validation logic (is_valid_func)
    var LogicalConditionTemplate = function(c1, c2) {
        if (typeof c1 != "object") { throw new Error("ArgumentException: c1. Expecting a Condition object. Actual value " + c1); }
        if (typeof c2 != "object") { throw new Error("ArgumentException: c1. Expecting a Condition object. Actual value " + c2); }
        // name of type. used for json serialization
        this.className = className;
        // left condition instance
        this.c1 = c1;
        // right condition instance
        this.c2 = c2;
        // validates left and right condition using supplied func (and/or)
        this.is_valid = function(engine) { return is_valid_func(this.c1, this.c2, engine); }
    }
    return LogicalConditionTemplate;
}

// Logical OR Condition
var OrCondition = CreateLogicalConditionClass("OrCondition", function(c1, c2, engine) {
    return c1.is_valid(engine) || c2.is_valid(engine);
});
// Logical AND Condition
var AndCondition = CreateLogicalConditionClass("AndCondition", function(c1, c2, engine) {
    return c1.is_valid(engine) && c2.is_valid(engine);
});

// Class factory
var CreateActionClass = function(className, execute_func) {

    var ActionTemplate = function(args, repeat) {
        // name of type. used for json serialization
        this.className = className;
        // store arguments
        this.args = args;
        // should action be executed only once or every time the event and condition are met
        this.repeat = typeof repeat !== 'undefined' ? repeat : false;
        // flag to indicate if action ran once
        this.executed = false;
        // executes action if conditions are met
        this.execute = function(engine) {
            // if allowed repeated execution => execute
            // if disallowed repeated execution and action haven't ran yet => execute
            if (this.repeat || !this.executed) { 
                execute_func(engine, this.args);
                this.executed = true;
            }
        }
    }

    // return class (not instance!)
    return ActionTemplate;
}

// Class definition (builds class, not instance)
var SetLocationStateAction = CreateActionClass("SetLocationStateAction", function(engine, args) {
    engine.locations.get(args.location_id).state = args.new_state;
});

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
        var index = this.links.indexOf(l);
        if (index > -1) { this.links.splice(index, 1); }
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
    this.set_state = function(state) { this.l.state = state; return this; }
    // adds text to the location for given state
    this.set_text = function(state, text) { this.l.set_text(state, text); return this; }
    // adds link to the location - Old
    this.add_link = function(target_id, text, state) { 
        var link = new Link();
        link.target_id = target_id;
        link.text = text;
        if (typeof state !== "undefined") { link.state = state; }
        this.l.add_link(link);
        return this;
    }
    // add criteria
    this.set_criteria = function(criteria) {this.l.criteria = criteria; return this}
    // Add Links = 
    this.set_links = function(links) {this.l.links = links; return this}

    // gets Location instance with configured data
    this.build = function() { return this.l; }
}

// Link to other Locations - Old
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
    // gets all locations as array
    this.all = function() { list = []; for (var id in this.locations) list.push(this.get(id)); return list; }
}

// Publish-Subscribe engine
var PubSub = function() {
    // array of events. every event contains array of subscribed functions
    this.events = {};
    // event published callback
    this.event_published_callback = null;
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
        if (this.events[e] != undefined) { 
            // call all subscribers
            for (var i in this.events[e]) {
                // IMPORTANT: function will be executed under context of caller! this means context of "this" keyword will change
                this.events[e][i](data);
            }
        }
        // notify callback that event handlers for the event were executed
        if (typeof this.event_published_callback == "function") {
            this.event_published_callback(e, data);
        }
    }
}

