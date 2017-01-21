// Test Suite
describe("Game Engine", function() {

describe("Player", function() {

it("Create player", function() {
    // arrange, act
    var player = new Player();

    // assert
    expect(player.location_id).not.toBe(undefined);
    expect(player.location_id).toBe("default");
});

}); // Player

});