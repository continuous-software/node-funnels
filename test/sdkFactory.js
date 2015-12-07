var test = require('tape');

var nock = require('nock');
var Sdks = require('../lib/sdkFactory.js');
var assert = require('assert');
var schema = {
  "description": "Payment api for funnels.io",
  "$schema": "http://json-schema.org/draft-04/hyper-schema",
  "title": "Funnels Payment API",
  "type": "object",
  "properties": {
    "banks": {
      "links": [
        {
          "description": "I get a page list of the bank integrations",
          "href": "/banks",
          "method": "GET",
          "rel": "list",
          "schema": {
            "type": "object",
            "properties": {
              "itemsByPage": {
                "type": [
                  "string",
                  "integer"
                ],
                "description": "The number of items you wan a page to contain",
                "default": 10
              },
              "offset": {
                "type": [
                  "string",
                  "integer"
                ],
                "description": "The index of the first item of the page",
                "default": 0
              },
              "orderBy": {
                "type": [
                  "string"
                ],
                "description": "the name of the property you want to order by"
              },
              "orderReverse": {
                "type": [
                  "string",
                  "boolean"
                ],
                "description": "if you want the order to be reversed"
              }
            },
            "required": []
          }
        },
        {
          "description": "I get the details for a particular bank",
          "href": "/banks/{id}",
          "method": "GET",
          "rel": "find",
          "schema": {
            "type": "object",
            "properties": {
              "fields": {
                "type": [
                  "string",
                  "array"
                ],
                "description": "the list of the properties you want to receive"
              }
            },
            "required": []
          }
        },
        {
          "description": "I update a particular bank",
          "href": "/banks/{id}",
          "method": "PUT",
          "rel": "update",
          "schema": {
            "type": "object",
            "properties": {
              "configuration": {
                "type": "object",
                "description": "the configuration of you payment system: credentials (see each gateway for more details)"
              },
              "title": {
                "description": "A label given by the merchant to the gateway",
                "example": "Virtualmerchant high traffic",
                "type": [
                  "string"
                ]
              }
            },
            "required": []
          }
        },
        {
          "description": "I create a bank",
          "href": "/banks",
          "method": "POST",
          "rel": "create",
          "schema": {
            "type": "object",
            "properties": {
              "configuration": {
                "type": "object",
                "description": "the configuration of you payment system: credentials (see each gateway for more details)"
              },
              "title": {
                "description": "A label given by the merchant to the gateway",
                "example": "Virtualmerchant high traffic",
                "type": [
                  "string"
                ]
              }
            },
            "required": [
              "title",
              "type"
            ]
          }
        },
        {
          "description": "I delete a bank",
          "href": "/banks/{id}",
          "method": "DELETE",
          "rel": "destroy",
          "schema": {
            "type": "object",
            "properties": {},
            "required": []
          }
        }
      ]
    },
    "payments": {
      "links": [
        {
          "description": "delegate a payment to a specific bank",
          "href": "/banks/:bankId/payments",
          "method": "POST",
          "rel": "create",
          "schema": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "order": {
                    "type": "object",
                    "properties": {
                      "amount": {
                        "type": [
                          "string",
                          "number"
                        ]
                      },
                      "currency": {
                        "type": [
                          "string",
                          "null"
                        ]
                      }
                    }
                  },
                  "payment": {
                    "type": "object",
                    "properties": {
                      "number": {
                        "type": "string"
                      },
                      "expirationMonth": {
                        "type": "string"
                      },
                      "expirationYear": {
                        "type": "string"
                      },
                      "cardholder": {
                        "type": "string"
                      },
                      "cvv2": {
                        "type": "string"
                      }
                    }
                  },
                  "prospect": {
                    "type": "object",
                    "properties": {
                      "firstname": {
                        "type": "string"
                      },
                      "lastname": {
                        "type": "string"
                      },
                      "email": {
                        "type": "string"
                      },
                      "phone": {
                        "type": "string"
                      },
                      "address1": {
                        "type": "string"
                      },
                      "address2": {
                        "type": "string"
                      },
                      "city": {
                        "type": "string"
                      },
                      "region": {
                        "type": "string"
                      },
                      "country": {
                        "type": "string"
                      },
                      "zipcode": {
                        "type": "string"
                      }
                    }
                  }
                },
                "required": [
                  "order",
                  "payment",
                  "prospect",
                  "id"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "order": {
                    "type": "object",
                    "properties": {
                      "amount": {
                        "type": [
                          "string",
                          "number"
                        ]
                      },
                      "currency": {
                        "type": [
                          "string",
                          "null"
                        ]
                      }
                    }
                  },
                  "payment": {
                    "type": "object",
                    "properties": {
                      "paymentToken": {
                        "type": "string"
                      }
                    }
                  }
                },
                "required": [
                  "order",
                  "payment"
                ]
              }
            ]
          }
        }
      ]
    },
    "tokens": {
      "links": [
        {
          "description": "create a payment token",
          "href": "/banks/:bankId/tokens",
          "method": "POST",
          "rel": "create",
          "schema": {
            "type": "object",
            "properties": {
              "payment": {
                "type": "object",
                "properties": {
                  "number": {
                    "type": "string"
                  },
                  "expirationMonth": {
                    "type": "string"
                  },
                  "expirationYear": {
                    "type": "string"
                  },
                  "cardholder": {
                    "type": "string"
                  },
                  "cvv2": {
                    "type": "string"
                  }
                }
              },
              "prospect": {
                "type": "object",
                "properties": {
                  "firstname": {
                    "type": "string"
                  },
                  "lastname": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "phone": {
                    "type": "string"
                  },
                  "address1": {
                    "type": "string"
                  },
                  "address2": {
                    "type": "string"
                  },
                  "city": {
                    "type": "string"
                  },
                  "region": {
                    "type": "string"
                  },
                  "country": {
                    "type": "string"
                  },
                  "zipcode": {
                    "type": "string"
                  }
                }
              }
            },
            "required": [
              "payment",
              "prospect"
            ]
          }
        }
      ]
    }
  }
};
var banksFactory = Sdks(schema.properties.banks.links, {host: 'foo.io'});


test('should send a get request to the good uri and authorization header', function (t) {
  const scope = nock('http://foo.io', {
    reqheaders: {
      'authorization': 'Bearer token'
    }
  })
    .get('/banks')
    .reply(200, {count: 3, rows: [{id: 123}]});
  banksFactory('token').list()
    .then(function (result) {
      assert.deepEqual(result, {count: 3, rows: [{id: 123}]}, 'should have the expected result');

      t.end();
    })
    .catch(t.end);
});

test('should pass extra parameters as query string', function (t) {
  const scope = nock('http://foo.io', {
    reqheaders: {
      'authorization': 'Bearer token'
    }
  })
    .get('/banks')
    .query({bar: 'blah', dude: 'whoot'})
    .reply(200, {count: 3, rows: [{id: 123}]});
  banksFactory('token').list({bar: 'blah', dude: 'whoot'})
    .then(function (result) {
      assert.deepEqual(result, {count: 3, rows: [{id: 123}]}, 'should have the expected result');
      t.end();
    })
    .catch(t.end);
});

test('should handle error (return status code and body)', function (t) {
  const scope = nock('http://foo.io', {
    reqheaders: {
      'authorization': 'Bearer token'
    }
  })
    .get('/banks')
    .reply(404, {message: 'could not be found'});
  banksFactory('token').list()
    .then(function (result) {
      throw new Error('should not be here')
    })
    .catch(function (err) {
      assert.equal(err.httpStatusCode, 404, 'should have the status code');
      assert.equal(err.message, 'could not be found', 'should have the response details');
      t.end();
    });
});

test('should support fragmented url', function (t) {
  const scope = nock('http://foo.io', {
    reqheaders: {
      'authorization': 'Bearer token'
    }
  })
    .get('/banks/444')
    .reply(200, {foo: 'bar'});
  banksFactory('token').find(444)
    .then(function (result) {
      assert.deepEqual(result, {foo: 'bar'}, 'should have the expected result');

      t.end();
    })
    .catch(t.end);
});

test('should support fragmented url and query parameters', function (t) {
  const scope = nock('http://foo.io', {
    reqheaders: {
      'authorization': 'Bearer token'
    }
  })
    .get('/banks/444')
    .query({foo: 'bar'})
    .reply(200, {foo: 'bar'});
  banksFactory('token').find(444, {foo: 'bar'})
    .then(function (result) {
      assert.deepEqual(result, {foo: 'bar'}, 'should have the expected result');
      t.end();
    })
    .catch(t.end);
});


test('should pass parameters as body object', function (t) {
  const scope = nock('http://foo.io', {
    reqheaders: {
      'authorization': 'Bearer token'
    }
  })
    .post('/banks', {
      title: 'new bank',
      type: 'virtualmerchant'
    })
    .reply(201, {title: 'new bank', id: 666, type: 'virtualmerchant'});
  banksFactory('token').create({title: 'new bank', type: 'virtualmerchant'})
    .then(function (result) {
      assert.deepEqual(result, {
        title: 'new bank',
        id: 666,
        type: 'virtualmerchant'
      }, 'should have the expected result');
      assert(scope.isDone(), 'there should not be any pending request');
      t.end();
    })
    .catch(function (err) {
      console.log(err);
    });
});

test('should support fragmented url', function (t) {
  const scope = nock('http://foo.io', {
    reqheaders: {
      'authorization': 'Bearer token'
    }
  })
    .put('/banks/444', {title: 'updated'})
    .reply(200, {title: 'updated'});
  banksFactory('token').update(444, {title: 'updated'})
    .then(function (result) {
      assert.deepEqual(result, {title: 'updated'}, 'should have the expected result');
      assert(scope.isDone(), 'should not have pending expectation');
      t.end();
    })
    .catch(t.end);
});