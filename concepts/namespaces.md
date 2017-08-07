# Namespaces

```

/* Generic function to create namespace object with optional namespace sub-objects
	Usage: var ns = namespace("MyCompany.MyProduct.Model"); 
*/
function namespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';    
        
    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    
    return parent;
}

// define namespaces
// normally we would have separated this into two or more files but for simplicity we create two namespaces and below populate them with functions and classes
var engine = namespace("TextGame.Engine");
var common = namespace("TextGame.Common");

common.setupInheritance = function(derived, base)
{
	derived.prototype = new base();
	derived.baseCtor = base;
}
	

//////////////////
// Sample classes
//////////////////


// Class A is base

engine.A = function() {
	this.val = 0;	
	this.getVal = function() { return this.val; }
}

// Class B derives from A

engine.B = function() {
	//B.baseCtor.call(this); // this works too if base constructor has no params
	engine.B.baseCtor.apply(this, arguments); 
}

common.setupInheritance(engine.B,engine.A);	

// Test
var a = new engine.A();
a.val = 1;

var b = new engine.B();
b.val = 2;

document.write(a.getVal());
document.write("<br>");
document.write(b.getVal());

```