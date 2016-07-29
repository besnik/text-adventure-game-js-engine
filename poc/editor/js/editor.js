// HELPERS //////////////////////////////////////////////////////////////////////////////////

// Usage: "The {a} says {n}, {n}, {n}!".supplant({ a: 'cow', n: 'moo' })
String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

// logs error message. error is always logged. if not error then it depends on global settings in editor.debug
function log(message, isError, ex) {
    if (typeof message != "string") return;
    if (typeof isError != "boolean") isError = false;

    if (editor.debug || isError) { 
        try {
            prefix = isError ? "ERROR: " : "INFO: ";
            if (typeof ex != "undefined" && ex.stack) { message += ex.stack }

            console.log(prefix + message);
        } 
        catch(ex) {
            // your browser does not support console.log
        }
    }
}

var PubSub = function() {
    
    // array of events. every event contains array of subscribed functions
    this.events = {};
    
    // adds function to event
    this.subscribe = function(e, listener) {
        if (typeof e != "string") { throw new Error("ArgumentException: e. Expecting string. Actual value " + e); }
        if (typeof listener != "function") { throw new Error("ArgumentException: listener. Expecting function. Actual value " + listener); }
        
        if (this.events[e] == undefined) { 
            this.events[e] = [];
        }
        
        this.events[e].push(listener);
    }
    
    // calls functions subscribed for event with given data
    this.publish = function(e, data) {
        if (typeof e != "string") { throw new Error("ArgumentException: e. Expecting string. Actual value " + e); }
        
        if (this.events[e] == undefined) { 
            return;
        }
        
        for (var i in this.events[e]) {
            //this.events[e][i](data);
            this.events[e][i].call(null, data);
        
        }
    }
    
}

// MODEL ///////////////////////////////////////////////////////////////////////////////////

var editor = {
    debug: true,
    game: {
        id: "New game id",
    }
}

editor.game.events = new PubSub();
editor.game.events.LevelAdded = "LevelAdded";

editor.game.levels = {
    items: [],
    get: function(id) {
        result = this.items.find(function(level){ return level.id == id });
        if (result == undefined) { result = null; }
        return result;
    },
    add: function(level) {
        this.items.push(level);

        log(editor.game.events.LevelAdded + " event firing")
        editor.game.events.publish(editor.game.events.LevelAdded, level);
    }
}

editor.factory = {
    createLevel: function(id, name, text) {
        return {
            id: id,
            name: name,
            text: text
        };
    }
}




// VIEW ////////////////////////////////////////////////////////////////////////////////////
editor.ui = {
    gameEditor: {},
    levelEditor: {}
};

editor.ui.setCssDisplay = function (el, val) {
    if (el != null) { el.style.display = val; }  
}

editor.ui.hideElement = function (el) {
    editor.ui.setCssDisplay(el, "none");
}

editor.ui.showElement = function (el) {
    log("Showing element \"" + el.id + "\" HTML: " + el.outerHTML.substr(0, 100));
    editor.ui.setCssDisplay(el, "block");
}

// elements of all views
editor.ui.views = document.querySelectorAll(".view");

// hide all views
editor.ui.hideAll = function() {
    log("Hiding all views");
    for (var i = 0; i<editor.ui.views.length; i++) {
        editor.ui.hideElement(editor.ui.views[i]);
    }
}

// LEVEL EDITOR VIEW --------------------------------------------------------------------
editor.ui.levelEditor.el = document.querySelector("#levelEditor");
editor.ui.levelEditor.btnBack = editor.ui.levelEditor.el.querySelector("#btnBack");
editor.ui.levelEditor.btnSave = editor.ui.levelEditor.el.querySelector("#btnSave");
editor.ui.levelEditor.errorMsg = editor.ui.levelEditor.el.querySelector("#errorMsg");

editor.ui.levelEditor.btnBack.addEventListener("click", function() {
    log("Event: click, Element: Back button of Level Editor");
    try {
        editor.ui.gameEditor.show();
    }
    catch(ex) {
        var errorMsg = "Error in Back button event handler of Level editor. Details: " + ex.message;
        log(errorMsg, true, ex);
        editor.ui.levelEditor.showErrorMsg(errorMsg);
    }
});

editor.ui.levelEditor.btnSave.addEventListener("click", function() {
    log("Event: click, Element: Save button of Level Editor");
    try {
        // Validation
        if (!editor.ui.levelEditor.isValid()) { return; }

        // Get values from input html elements
        var levelId = editor.ui.levelEditor.el.querySelector("#txtLevelId").value;
        var levelName = editor.ui.levelEditor.el.querySelector("#txtLevelName").value;
        var levelText = editor.ui.levelEditor.el.querySelector("textarea").value
        
        // Create and store model
        var level = editor.factory.createLevel(levelId, levelName, levelText);
        editor.game.levels.add(level);
        
        // Clear form for next usage and show game editor
        editor.ui.levelEditor.reset();
        editor.ui.gameEditor.show();
    }
    catch(ex) {
        var errorMsg = "Error in Save button event handler of Level editor. Details: " + ex.message;
        log(errorMsg, true, ex);
        editor.ui.levelEditor.showErrorMsg(errorMsg);
    }
});

editor.ui.levelEditor.isValid = function() {
    
    // 1. TEXT BOXES NON EMPTY
    var errorMsg = "All text boxes must be non-empty."
    var inputs = editor.ui.levelEditor.el.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) { 
        if (inputs[i].value == "") {
            editor.ui.levelEditor.showErrorMsg(errorMsg);
            return false;
        }
    }

    if (editor.ui.levelEditor.el.querySelector("textarea").value == "") {
        editor.ui.levelEditor.showErrorMsg(errorMsg);
        return false;
    }  
    
    // 2. LEVEL ID IS UNIQUE
    var levelId = editor.ui.levelEditor.el.querySelector("#txtLevelId").value;
    if (editor.game.levels.get(levelId) != null) {
        editor.ui.levelEditor.showErrorMsg("Specified level ID is already used.");
        return false;
    }

    return true;
}

editor.ui.levelEditor.show = function() { 
    editor.ui.hideAll();
    editor.ui.showElement(editor.ui.levelEditor.el);
}

editor.ui.levelEditor.showErrorMsg = function(message) {
    var el = editor.ui.levelEditor.errorMsg;
    el.innerHTML = message;
    editor.ui.showElement(el);
}

editor.ui.levelEditor.reset = function() {
    // reset error message
    editor.ui.hideElement(editor.ui.levelEditor.errorMsg);

    // reset inputs
    var inputs = editor.ui.levelEditor.el.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) { inputs[i].value = ""; }
    
    // reset text area
    editor.ui.levelEditor.el.querySelector("textarea").value = "";  
}

// GAME EDITOR VIEW ---------------------------------------------------------------------
editor.ui.gameEditor.el = document.querySelector("#gameEditor");
editor.ui.gameEditor.btnAddLevel = editor.ui.gameEditor.el.querySelector("#btnAddLevel");
editor.ui.gameEditor.errorMsg = editor.ui.gameEditor.el.querySelector("#errorMsg");

editor.ui.gameEditor.btnAddLevel.addEventListener("click", function() {
    log("Event: click, Element: Add Level button of Game Editor");
    editor.ui.levelEditor.show();
});

editor.ui.gameEditor.show = function() { 
    editor.ui.hideAll();
    editor.ui.showElement(editor.ui.gameEditor.el);
}

editor.ui.gameEditor.showErrorMsg = function(message) {
    var el = editor.ui.gameEditor.errorMsg;
    el.innerHTML = message;
    editor.ui.showElement(el);
}

editor.ui.gameEditor.addLevelRow = function(level) {
    log("Creating html for new level added");

    try {
        var row = document.createElement("div");
        row.className = "row col-20 center sm-padding text-center lightyellow-bg xm-vt-margin";
        
        var divLevelId = document.createElement("div");
        divLevelId.className = "row col-8";
        divLevelId.innerText = level.id;
        row.appendChild(divLevelId);

        var divLevelName = document.createElement("div");
        divLevelName.className = "row col-12";
        divLevelName.innerText = level.name;
        row.appendChild(divLevelName);

        var divButton = document.createElement("div");
        divButton.className = "row col-4 sm-padding";
        row.appendChild(divButton);

        var button = document.createElement("button");
        button.className = "btn btn-primary no-margin";
        button.innerText = "Edit";
        button.setAttribute("levelid", level.id);
        divButton.appendChild(button);

        // insert into game editor
        var levelContainer = editor.ui.gameEditor.el.querySelector("#levelContainer");
        levelContainer.appendChild(row);
    }
    catch (ex) {
        log("Failed to create and append html row for level.", true, ex);
        editor.ui.gameEditor.showErrorMsg("ERROR: Failed to create and append html row for level. " + ex.message);
    }
}



// CONTROLLER
editor.game.events.subscribe(editor.game.events.LevelAdded, editor.ui.gameEditor.addLevelRow);


