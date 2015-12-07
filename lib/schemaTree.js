var $ = require('skeemas-json-pointer');
/**
 * utility to parse api-schema (following JSON-schema specification)
 * @param schema Object - the schema to transform (including json pointer $ref, etc)
 * @param definitions Object - the whole schema including definitions to resolve json-pointer
 * @returns Object - a whole explicit schema including all resolved field
 */
module.exports = function replace (schema, definitions) {
  'use strict';
  var output = {};
  if (schema.$ref) {
    output = $(schema.$ref).get(definitions);
  } else if (typeof schema !== 'object') {
    output = schema;
  } else if (Array.isArray(schema)) {
    output = schema.map(s => replace(s, definitions));
  } else {
    for (let prop in schema) {
      const val = replace(schema[prop], definitions);
      output[prop] = val;
    }
  }
  return output;
};