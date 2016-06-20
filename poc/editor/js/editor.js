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


// MODEL ///////////////////////////////////////////////////////////////////////////////////

var editor = {
    debug: true,
    game: {
        id: "New game id"
    }
}

editor.game.levels = {
    items: [],
    get: function(id) {
        result = this.items.find(function(level){ return level.id == id });
        if (result == undefined) { result = null; }
        return result;
    },
    add: function(level) {
        return this.items.push(level);
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

editor.ui.gameEditor.btnAddLevel.addEventListener("click", function() {
    log("Event: click, Element: Add Level button of Game Editor");
    editor.ui.levelEditor.show();
});

editor.ui.gameEditor.show = function() { 
    editor.ui.hideAll();
    editor.ui.showElement(editor.ui.gameEditor.el);
}



// CONTROLLER



