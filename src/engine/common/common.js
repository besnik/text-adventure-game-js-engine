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

/* Common Namespace */
var common = namespace("TextGame.Common");

/* Helper method to setup inheritance between two types */
common.setupInheritance = function(derived, base)
{
	derived.prototype = new base();
	derived.baseCtor = base;
}
