/* Service Namespace */
var service = namespace("TextGameEngine.Service");

/* Class SceneRepository
	Holds array of scens and provides methods to get and add scenes into repo
*/
service.SceneRepository = function(scenes) {
	this.scenes = typeof scenes !== "undefined" ? scenes : {};	// hash table of Scene type
	
	// finds scene by id in repository
	this.get = function(id) {
		return this.scenes[id];
	}
	
	// adds scene object into repository
	this.add = function(scene) {
		this.scenes[scene.id] = scene;
	}
}

