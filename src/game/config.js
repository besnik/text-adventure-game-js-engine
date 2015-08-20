// Configuration of Game Engine
// Initializes game object

var mock = namespace("TextGameEngine.Mock");
var model = namespace("TextGameEngine.Model");

// configuration
var config = {
	sceneRepo: mock.getSceneRepo()
}

// game instance
var game = new model.Engine(config);