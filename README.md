# Text Adventure Game Javascript Engine

Goal of the project is to create game engine and editor with rich and fluent API 
to create text-like games using javascript and other modern technologies for new age.

Game Engine and Game Editor are written in plain old javascript. Both game and editor engines
should run in any modern browser (or Node.js if needed).

If you are interested in latest progress check out `/poc/engine/engine2/` directory for 
latest prototype.

# Game and Editor APIs

Editor engine supports fluent API to setup a game:

```
// fallout 1 text version :-)

var l1 = editor.factory.location
    .new()
    .id("l1")
    .set_text("default", "You are standing infront of Vault13.")
    .set_text("modified", "Door to Vault13 are now closed.")
    .add_link("l2", "to Mutant Military Base")
    .build();

var l2 = editor.factory.location
    .new()
    .id("l2")
    .set_text("default", "After long journey you reached Mutant Military Base")
    .add_link("l1", "to Vault13")
    .build();

game = editor.new_game()
    .add_location(l1)
    .add_location(l2)
    .set_player_location(l1.id)
    .when_location_changed_to("l2").set_state_of_location("l1", "modified")
    .start_game();
```

The engine also supports methods like `.to_json()` and `.from_json(data)` to 
easily export and import game configuration.  

Game Engine also offers rich set of fluet APIs to play game.

```
game.see();
game.go("l2");
game.see();
game.go("l1").see();
game.take('gun').talk('vic').use('door')
```

Thanks to APIs in both Game and Editor engines you can create any customized frontend
experience using any modern framework of your choice. Web, Desktop or Mobile based.

The project will aim to provide native implementation for web and mobile UI using modern
technologies like Angular, React, React Native.

Also one of the long term goals is to provide API to easily integrate with major cloud
provides like AWS or Google Cloud to store game data (both game configurations and sessions)
for even more interesting game experience.

# Feedback

I'd love to get feedback on this project, design of engine, roadmap or any new ideas!
Feel free to open ticket or reach out to me directly.