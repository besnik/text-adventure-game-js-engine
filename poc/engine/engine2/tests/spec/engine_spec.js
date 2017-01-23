// Test Suite
// see SpecRunner.html to see structure of test suites
describe("Game Engine", function() {

describe("Player", function() {

var player;

beforeEach(function() { player = new Player(); });

it("Create", function() {
    expect(player.location_id).not.toBe(undefined);
    expect(player.location_id).toBe("default");
});

}); // Player

describe("PubSub", function() {

var events;

beforeEach(function() { events = new PubSub(); });

it("Create", function() {
    expect(events).toBeDefined();
    expect(events.events).toBeDefined();
    expect(typeof events.events).toBe("object");
    expect(events.publish).toBeDefined();
    expect(events.subscribe).toBeDefined();
    expect(events.event_published_callback).toBeNull();
});

it("Subscribe without params throws Error", function() {
    expect(function() { events.subscribe(); }).toThrowError(Error);
});

it("Subscribe first param not string throws Error", function() {
    expect(function() { events.subscribe({}); }).toThrowError(Error);
});

it("Subscribe second param not function throws Error", function() {
    expect(function() { events.subscribe("changed", {}); }).toThrowError(Error);
});

it("Subscribe a function", function() {
    // arrange
    function dummy() {}

    // act
    events.subscribe("changed", dummy);

    // assert
    expect(events.events["changed"]).toBeDefined();
    expect(events.events["changed"].length).toBe(1);
    expect(events.events["changed"][0]).toBe(dummy);

});

it("Publish without params throws Error", function() {
    expect(function() { events.publish(); }).toThrowError(Error);
});

it("Publish event with no subscribers", function() {
    expect(function() { events.publish("changed", {}); }).not.toThrowError();
});

it("Publish event with no subscribers and no data", function() {
    expect(function() { events.publish("changed"); }).not.toThrowError();
});

it("Publish event with subscriber", function() {
    // arrange
    var data = {};
    function handler(d) { expect(d).toBe(data); };
    events.subscribe("changed", handler);

    // act
    events.publish("changed", data);
});

it("Publish event with no data with subscriber", function() {
    // arrange
    var data = {};
    function handler(d) { expect(d).toBe(undefined); };
    events.subscribe("changed", handler);

    // act
    events.publish("changed");
});

it("Publish event with subscriber and event_published_callback", function() {
    // arrange
    var event_type = "changed";
    var data = {};
    function handler(d) { expect(d).toBe(data); };
    function callback(e, d) {
        expect(e).toBe(event_type);
        expect(d).toBe(data);
    }
    events.event_published_callback = callback;
    events.subscribe(event_type, handler);

    // act
    events.publish("changed", data);
});

it("Publish event with no subscriber and event_published_callback", function() {
    // arrange
    var event_type = "changed";
    var data = {};
    function callback(e, d) {
        expect(e).toBe(event_type);
        expect(d).toBe(data);
    }
    events.event_published_callback = callback;

    // act
    events.publish("changed", data);
});

}); // PubSub

describe("LocationRepository", function() {

    var repo, l;

    beforeEach(function() { 
        repo = new LocationRepository();
        l = { id: "1" };
    });

    it("Create", function() {
        expect(repo.locations).toBeDefined();
        expect(repo.get).toBeDefined();
        expect(repo.add).toBeDefined();
        expect(repo.remove).toBeDefined();
        expect(repo.all).toBeDefined();
    });

    it("Add", function(){
        // act
        repo.add(l);
        // assert
        expect(repo.locations[l.id]).toBe(l);
    });

    it("Remove", function() {
        // arrange
        repo.add(l);
        expect(repo.locations[l.id]).toBe(l);
        // act
        repo.remove(l);
        // assert
        expect(repo.locations[l.id]).toBe(undefined);
    });

    it("Get", function() {
        // arrange
        repo.add(l);
        // act
        r = repo.get(l.id);
        // assert
        expect(r).toBe(l);
    });

    it("All", function() {
        // arrange
        var locations = [], count = 10; 
        for (var i=0; i<count; i++) {
            locations.push({id:i.toString()});
            repo.add(locations[i]);
        }
        // act
        var items = repo.all();
        // assert
        expect(locations.length).toBe(items.length);
        for (var i=0; i<count; i++) {
            expect(items[i]).toBe(locations[i]);
        }
    });

}); // LocationRepository

describe("Link", function() {

    var link;

    beforeEach(function() { link = new Link(); });

    it("Create", function() {
        expect(link.target_id).toBe("default");
        expect(link.text).toBe("default link text");
        expect(link.state).toBe("default");
    });

}); // Link

describe("LocationFactory", function() {

    var factory;

    beforeEach(function() { factory = new LocationFactory(); });

    it("Create", function() {
        expect(factory.l).toBeNull();
    });

    it("Build new location", function() {
        // act
        var l = factory.new()
            .id("l1")
            .set_state("state")
            .set_text("state","text")
            .set_text("state2","text2")
            .add_link("l2", "l2text", "state3")
            .add_link("l3","l3text") // default state
            .build();
        // assert
        expect(l).toBeDefined();
        expect(l.id).toBe("l1");
        expect(l.state).toBe("state");
        expect(l.texts["state"]).toBe("text");
        expect(l.texts["state2"]).toBe("text2");
        expect(l.links.length).toBe(2);
        expect(l.links[0].target_id).toBe("l2");
        expect(l.links[0].text).toBe("l2text");
        expect(l.links[0].state).toBe("state3");
        expect(l.links[1].target_id).toBe("l3");
        expect(l.links[1].text).toBe("l3text");
        expect(l.links[1].state).toBe("default");
    });

    it("Alter existing location", function() {
        // arrange
        var l = new LocationFactory().new()
            .id("l1")
            .set_state("state")
            .set_text("state","text")
            .set_text("state2","text2")
            .add_link("l2", "l2text", "state3")
            .add_link("l3","l3text") // default state
            .build();
        // act
        var result = factory.for(l).id("l11").build();
        // assert
        expect(result).toBe(l);
        expect(result.id).toBe("l11");
    });

}); // LocationFactory

describe("Location", function() {

    var l;

    beforeEach(function() { l = new Location(); });

    it("Create", function() {
        expect(l.id).toBe("default");
        expect(l.state).toBe("default");
        expect(l.texts).toBeDefined();
        expect(l.texts[l.state]).toBeDefined();
        expect(l.links).toBeDefined();
        expect(l.links.length).toBe(0);
    });

    it("Get text for given state", function() {
        // arrange
        l.state = "state";
        l.texts[l.state] = "text";
        // act
        var s = l.get_text();
        // assert
        expect(s).toBe("text");
    });

    it("Set text for given state", function() {
        // act
        l.set_text("state", "text1");
        // assert
        expect(l.texts["state"]).toBe("text1");
    });

    it("Add links to location", function() {
        // arrange
        var link1 = {};
        // act
        l.add_link(link1);
        // assert
        expect(l.links.length).toBe(1);
        expect(l.links[0]).toBe(link1);
        // add more links
        var link2 = {};
        l.add_link(link2);
        // assert
        expect(l.links.length).toBe(2);
        expect(l.links[0]).toBe(link1);
        expect(l.links[1]).toBe(link2);
    });

    it("Removes links from location", function() {
        // arrange
        var link1 = {}, link2 = {}, link3 = {}, link4 = {};
        l.add_link(link1);
        l.add_link(link2);
        l.add_link(link3);
        l.add_link(link4);
        // act
        l.remove_link(link2); // link in the middle
        // assert
        expect(l.links.length).toBe(3);
        expect(l.links[0]).toBe(link1);
        expect(l.links[1]).toBe(link3);
        expect(l.links[2]).toBe(link4);
        // act - remove first link
        l.remove_link(link1);
        // assert
        expect(l.links.length).toBe(2);
        expect(l.links[0]).toBe(link3);
        expect(l.links[1]).toBe(link4);
        // act - remove last link
        l.remove_link(link4);
        // assert
        expect(l.links.length).toBe(1);
        expect(l.links[0]).toBe(link3);
        // act - remove single link
        l.remove_link(link3);
        expect(l.links.length).toBe(0);
    });

}); // Location

describe("SetLocationStateAction", function() {

    it("Create", function() {
        var a = new SetLocationStateAction({location_id: "l2", new_state: "new_state"}, true);
        expect(a.className).toBeDefined();
        expect(a.args.location_id).toBe("l2");
        expect(a.args.new_state).toBe("new_state");
        expect(a.repeat).toBe(true);
        expect(a.executed).toBe(false);
        expect(a.execute).toBeDefined();
    });

    it("Create without repeat", function() {
        var a = new SetLocationStateAction({location_id: "l2", new_state: "new_state"});
        expect(a.repeat).toBe(false);
    });

    it("Execute action with repeat enabled (allow multiple executions)", function() {
        // arrange
        var l = { state: "default" };
        var engineMock = {
            locations: {
                get: function(id) { if (id != "l2") throw 1; return l; }
            }
        };
        // Instance definition (creates instance of dynamically created class)
        var a = new SetLocationStateAction({location_id: "l2",new_state: "new_state" }, true);
        // act
        a.execute(engineMock);
        // assert
        expect(l.state).toBe("new_state");
        // set location back to original state
        l.state = "default";
        // act - again change the state
        a.execute(engineMock);
        // assert
        expect(l.state).toBe("new_state");
    });

    it("Execute action with repeat disabled (allow single execution)", function() { 
        // arrange
        var l = { state: "default" };
        var engineMock = {
            locations: {
                get: function(id) { if (id != "l2") throw 1; return l; }
            }
        };
        // Instance definition (creates instance of dynamically created class)
        var a = new SetLocationStateAction({ location_id: "l2", new_state: "new_state" });
        // act
        a.execute(engineMock);
        // assert
        expect(l.state).toBe("new_state");
        // set location back to original state
        l.state = "default";
        // act - again change the state
        a.execute(engineMock);
        // assert
        expect(l.state).toBe("default");
    });

}); // SetLocationStateAction

describe("Logical Conditions AND", function() {

    var c_true = { is_valid: function(engine) {return true;} }
    var c_false = { is_valid: function(engine) {return false;} }

    it("Create", function() {
        var ca = new AndCondition(c_true, c_false);
        expect(ca.className).toBe("AndCondition");
        expect(ca.c1).toBe(c_true);
        expect(ca.c2).toBe(c_false);
    });

    it("AND: true, true", function() {
        var ca = new AndCondition(c_true, c_true);
        var r = ca.is_valid({});
        expect(r).toBe(true);
    });

    it("AND: true, false", function() {
        var ca = new AndCondition(c_true, c_false);
        var r = ca.is_valid({});
        expect(r).toBe(false);
    });

    it("AND: false, true", function() {
        var ca = new AndCondition(c_false, c_true);
        var r = ca.is_valid({});
        expect(r).toBe(false);
    });

    it("AND: false, false", function() {
        var ca = new AndCondition(c_false, c_false);
        var r = ca.is_valid({});
        expect(r).toBe(false);
    });

}); // Logical Conditions AND

describe("Logical Conditions OR", function() {

    var c_true = { is_valid: function(engine) {return true;} }
    var c_false = { is_valid: function(engine) {return false;} }

    it("Create", function() {
        var ca = new OrCondition(c_true, c_false);
        expect(ca.className).toBe("OrCondition");
        expect(ca.c1).toBe(c_true);
        expect(ca.c2).toBe(c_false);
    });

    it("OR: true, true", function() {
        var ca = new OrCondition(c_true, c_true);
        var r = ca.is_valid({});
        expect(r).toBe(true);
    });

    it("OR: true, false", function() {
        var ca = new OrCondition(c_true, c_false);
        var r = ca.is_valid({});
        expect(r).toBe(true);
    });

    it("OR: false, true", function() {
        var ca = new OrCondition(c_false, c_true);
        var r = ca.is_valid({});
        expect(r).toBe(true);
    });

    it("OR: false, false", function() {
        var ca = new OrCondition(c_false, c_false);
        var r = ca.is_valid({});
        expect(r).toBe(false);
    });

}); // Logical Conditions OR

describe("LocationCondition", function() {

    it("Create", function() {
        var c = new LocationCondition("l2");
        expect(c.className).toBe("LocationCondition");
        expect(c.location_id).toBe("l2");
    });

    it("Valid condition", function() {
        var c = new LocationCondition("l2");
        var r = c.is_valid({player: {location_id: "l2"}});
        expect(r).toBe(true); 
    });

    it("Invalid condition", function() {
        var c = new LocationCondition("l2");
        var r = c.is_valid({player: {location_id: "l3"}});
        expect(r).toBe(false); 
    });

}); // LocationCondition

describe("EventHandler", function() {

    it("Create", function() {
        var ac = new EventHandler("changed");
        expect(ac.event_type).toBe("changed");
        expect(ac.conditions).toBeDefined();
        expect(ac.conditions.length).toBe(0);
        expect(ac.actions).toBeDefined();
        expect(ac.actions.length).toBe(0);
    });

    it("Add condition", function() {
        var ac = new EventHandler("changed");
        var c = {};
        ac.add_condition(c);
        expect(ac.conditions.length).toBe(1);
        expect(ac.conditions[0]).toBe(c);
    });

    it("Add action", function() {
        var ac = new EventHandler("changed");
        var a = {};
        ac.add_action(a);
        expect(ac.actions.length).toBe(1);
        expect(ac.actions[0]).toBe(a);
    });

    it("Add condition & action", function() {
        var ac = new EventHandler("changed");
        var c = {}, a = {};
        ac.add(c,a);
        expect(ac.conditions.length).toBe(1);
        expect(ac.conditions[0]).toBe(c);
        expect(ac.actions.length).toBe(1);
        expect(ac.actions[0]).toBe(a);
    });

    var c_true = { is_valid: function(engine) {return true;} }
    var c_false = { is_valid: function(engine) {return false;} }

    var DummyAction = function() {
        this.executed = false;
        this.execute = function(engine) { this.executed = true; }
    }

    it("Execute: True, True, Action, Action", function() {
        var ac = new EventHandler("changed");
        var a1 = new DummyAction(), a2 = new DummyAction();
        ac.add(c_true, a1);
        ac.add(c_true, a2);
        ac.execute({});
        expect(a1.executed).toBe(true);
        expect(a2.executed).toBe(true);
    });

    it("Execute: True, False, Action, Action", function() {
        var ac = new EventHandler("changed");
        var a1 = new DummyAction(), a2 = new DummyAction();
        ac.add(c_true, a1);
        ac.add(c_false, a2);
        ac.execute({});
        expect(a1.executed).toBe(false);
        expect(a2.executed).toBe(false);
    });

    it("Execute: False, True, Action, Action", function() {
        var ac = new EventHandler("changed");
        var a1 = new DummyAction(), a2 = new DummyAction();
        ac.add(c_false, a1);
        ac.add(c_true, a2);
        ac.execute({});
        expect(a1.executed).toBe(false);
        expect(a2.executed).toBe(false);
    });

    it("Execute: False, False, Action, Action", function() {
        var ac = new EventHandler("changed");
        var a1 = new DummyAction(), a2 = new DummyAction();
        ac.add(c_false, a1);
        ac.add(c_false, a2);
        ac.execute({});
        expect(a1.executed).toBe(false);
        expect(a2.executed).toBe(false);
    });

    it("Execute: True AND True, Action, Action", function() {
        var ac = new EventHandler("changed");
        var a1 = new DummyAction(), a2 = new DummyAction();
        ac.add_condition(new AndCondition(c_true, c_true));
        ac.add_action(a1);
        ac.add_action(a2);
        ac.execute({});
        expect(a1.executed).toBe(true);
        expect(a2.executed).toBe(true);
    });

    it("Execute: True AND False, Action, Action", function() {
        var ac = new EventHandler("changed");
        var a1 = new DummyAction(), a2 = new DummyAction();
        ac.add_condition(new AndCondition(c_true, c_false));
        ac.add_action(a1);
        ac.add_action(a2);
        ac.execute({});
        expect(a1.executed).toBe(false);
        expect(a2.executed).toBe(false);
    });

    it("Execute: True OR False, Action, Action", function() {
        var ac = new EventHandler("changed");
        var a1 = new DummyAction(), a2 = new DummyAction();
        ac.add_condition(new OrCondition(c_true, c_false));
        ac.add_action(a1);
        ac.add_action(a2);
        ac.execute({});
        expect(a1.executed).toBe(true);
        expect(a2.executed).toBe(true);
    });

}); // ActionContainer

});