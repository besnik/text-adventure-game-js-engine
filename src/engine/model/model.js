/* Model Namespace */
var model = namespace("TextGameEngine.Model");

/* Class Scene */
model.Scene = function(id, text) {
	this.id = typeof id !== "undefined" ? id : "";
	this.text = typeof text !== "undefined" ? text : "";
}

/* Class Engine */
model.Engine = function(config) {
	this.sceneid = "start";	// by default scene with this id will be started
	this.sceneRepo = config.sceneRepo;
	
	
	// this will be outsourced into a view type
	this.getText = function() {
		return this.sceneRepo.get(this.sceneid).text;
	}
	
}
