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

    var repo;

    beforeEach(function() { repo = new LocationRepository(); });

    it("Create", function() {
        expect(repo.locations).toBeDefined();
        expect(repo.get).toBeDefined();
        expect(repo.add).toBeDefined();
        expect(repo.remove).toBeDefined();
        expect(repo.all).toBeDefined();
    });


}); // LocationRepository

});