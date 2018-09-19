/*
jquery.xml2json.js
by Remy Blom
created: 14 September 2015
MIT License applies
*/
(function() {
	function xml2json(xmldom, options) {
		var defaults = {
			includeDocument: false,
			includeRootNode: true,
			includeNodeTypes: false,
			includeNamespace: false,
			namespaceToAttribute: false,
			explicitArray: false,
			normalize: false,
			nameAttributesObject: '#attributes'

		};
		var config = $.extend(defaults, options)
		var returnObj = {};
		console.log("==xmldom==",xmldom);
		traverseXML(xmldom, {
			onDocument: function(obj) {
				if (!config.includeRootNode) {
					for (var key in obj) break;
					obj = obj[key];
				}
				if (config.includeDocument) {
					returnObj['#document'] = obj;
				} else {
					returnObj = obj;
				}
				// console.log("onDocument   ",obj);
			},
			onElement: function(nodeName, attributes, childNodes, obj) {
				if (obj === undefined) {
					obj = {};
				}
				if (obj[nodeName] === undefined) {
					obj[nodeName] = childNodes ? childNodes : {};
				} else {
					if (typeof obj[nodeName].push !== 'function') {
						obj[nodeName] = [obj[nodeName]];
					}
					obj[nodeName].push(childNodes ? childNodes : {});
				}
				if (attributes) {
					if (obj[nodeName][config.nameAttributesObject] === undefined) {
						obj[nodeName][config.nameAttributesObject] = {};
					}
					obj[nodeName][config.nameAttributesObject] = attributes;
				}
				return obj;
			},
			onAttribute: function(nodeName, nodeValue, obj) {
				if (obj === undefined) {
					obj = {};
				}
				obj[nodeName] = nodeValue;
				return obj;
			},
			onNodeValue: function(nodeName, nodeValue, obj) {
					if (obj === undefined) {
						obj = {};
					}
					if($.isEmptyObject(obj)){
						obj = nodeValue.trim();
					}else{
						obj[nodeName] = nodeValue.trim();
					}
					
					return obj;
			}
		});
		// console.log("returnObj",returnObj);
		return returnObj;
	}

	function traverseXML(xmldom, callbacks, appendObject) {
		var childNodes;
		var attributes;
		var nodeName = xmldom.nodeName;
		var nodeType = xmldom.nodeType;
		var nodeValue = xmldom.nodeValue;
		// children first
		if (xmldom.hasChildNodes()) {
			for(var i = 0; i < xmldom.childNodes.length; i++) {
				var childNode = xmldom.childNodes.item(i);
				childNodes = traverseXML(childNode, callbacks, childNodes);
			}
		}
		if (nodeName.includes('Response')) {
			// console.log("ResponseChild",childNodes);
			callbacks.onDocument({body: childNodes});
			return {body: childNodes}
		}else if(childNodes&&childNodes.body){
			return childNodes;
		}
		// 1: element
		if (nodeType === 1 && typeof callbacks.onElement === 'function') {
			if (xmldom.attributes.length > 0) {
				for (var j = 0; j < xmldom.attributes.length; j++) {
					var attribute = xmldom.attributes.item(j);
					attributes = traverseXML(attribute, callbacks, attributes);
				}
			}
			return callbacks.onElement(nodeName, attributes, childNodes, appendObject);;
		}
		// 2: attribute
		if (nodeType === 2 && typeof callbacks.onAttribute === 'function') {
			return callbacks.onAttribute(nodeName, nodeValue, appendObject)
		}
		// 3: text, nodeType = 4: cdata-section, nodeType = 8: comment
		if ((nodeType === 3 || nodeType === 4 || nodeType === 8) && typeof callbacks.onNodeValue === 'function') {
			if (nodeValue.trim() !== '') {
				return callbacks.onNodeValue(nodeName, nodeValue, appendObject);
			} else {
				return appendObject;
			}
		}
		// 9: document
		if (nodeType === 9 && typeof callbacks.onDocument === 'function') {
			return callbacks.onDocument(childNodes);
		}
	}

	if (typeof jQuery !== 'undefined') {
		jQuery.extend({xml2json: xml2json});
	} else if (typeof module !== 'undefined') {
		module.exports = xml2json;
	} else if (typeof window !== 'undefined') {
		window.xml2json = xml2json;
	}
})();