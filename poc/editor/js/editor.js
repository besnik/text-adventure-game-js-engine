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
function log(message, isError) {
    if (typeof message != "string") return;
    if (typeof isError != "boolean") isError = false;

    if (editor.debug || isError) { 
        try {
            prefix = isError ? "ERROR: " : "INFO: ";
            console.log(prefix + message);
        } 
        catch(ex) {
            // your browser is not supporting console.log
        }
    }
}


// MODEL ///////////////////////////////////////////////////////////////////////////////////

var editor = {
    debug: true
};


editor.game = {
    id: "New game id",
    levels : []
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
    log("Showing element " + el);
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
    editor.ui.gameEditor.show();
});

editor.ui.levelEditor.btnSave.addEventListener("click", function() {
    log("Event: click, Element: Save button of Level Editor");
    // TODO: validation
    // TODO: update model (this triggers event that in turn updates view)
    
    editor.ui.levelEditor.reset();
    editor.ui.gameEditor.show();
});

editor.ui.levelEditor.validate = function() {
    // TODO: are all inputs non-empty? call view
    // TODO: is level id unique? call model
    // TODO: show error message if needed
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



