'use strict';

var sdkFactory = require('./lib/sdkFactory.js');
var tree = require('./lib/schemaTree.js');
var request = require('got');
var url = require('url');

module.exports = {
  sdkFactory: sdkFactory,
  /**
   * create sdk factories
   * @param options Object - A set of options to override default configuration
   * @returns {*} Promise- namespace factories
   */
  createSdk: function (options) {
    const optionsOrDefault = Object.assign(
      {}, {
        endpoint: {
          protocol: 'https',
          host: 'api.funnels.io'
        },
        schemaUrl: 'https://api.funnels.io/public/schema.json'
      }, options);

    function resolveLinks (apiSchema) {
      'use strict';
      var sdks = {};

      for (let sdk in apiSchema.properties) {
        const schema = tree(apiSchema.properties[sdk], apiSchema);
        sdks[sdk] = sdkFactory(schema.links, optionsOrDefault.endpoint);
      }
      return sdks;
    }

    return optionsOrDefault.schema ?
      resolveLinks(optionsOrDefault.schema) :
      request.get(optionsOrDefault.schemaUrl, {
        json: true,
        headers: {
          'user-agent': 'funnels-api-sdk'
        }
      })
        .then(result => result.body)
        .then(resolveLinks);
  }
};
