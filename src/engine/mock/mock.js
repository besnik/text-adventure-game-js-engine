/* Mock Namespace */
var mock = namespace("TextGameEngine.Mock");

// dependencies
var model = namespace("TextGameEngine.Model");
var service = namespace("TextGameEngine.Service");

/* Mocked scenes */
mock.scenes = [
	{
		id: "start",
		text: "You stand on a planet X."
	}
];

/* Gets scene repository with mocked scenes */
mock.getSceneRepo = function() {
	var repo = new service.SceneRepository();
	
	for (var i in mock.scenes) {
		var s = mock.scenes[i];
		repo.add(new model.Scene(s.id, s.text));
	}

	return repo;
}




