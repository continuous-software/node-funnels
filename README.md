[![Circle CI](https://circleci.com/gh/continuous-software/node-funnels.svg?style=svg)](https://circleci.com/gh/continuous-software/node-funnels)

# node-funnels
funnels.io nodejs sdk

allow you to dynamically create sdk factories based on JSON schema specifications

```Javascript

var createSdk = require('funnels').createSdk;

// automatically fetch latest schema
createSdk()
   .then(funnels => {
   			return funnels.users().login({email:'foo', password:'bar'})
   				.then(result =>{
   					var token = result.token;
   					return funnels.products(token).instances()
   					  .then(products => {
   					  	return funnels.products(token).self(products.rows[0].id);
   					  })
   					  .then(product => {
   					     //etc
   					  });
   				});
   });
   
// use particular schema
createSdk({schema:{
		properties:{
				products:{
					   "links": [{
                  "authenticated": true,
                  "description": "get a list of products",
                  "href": "/products",
                  "method": "GET",
                  "rel": "instances",
                  "schema": {
                    "type": "object",
                    "properties": {
                      "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
                      "offset": {"type": ["integer", "string"], "minimum": 0},
                      "orderBy": {"type": "string"},
                      "orderReverse": {"type": ["string", "boolean"]},
                      "searchScope": {"type": "string"},
                      "searchQuery": {"type": "string"}
                    }
                  },
                  "targetSchema": {
                    "count": {"type": "integer", "minimum": 0},
                    "rows": {"type": "array", "items": {"$ref": "#/definitions/products"}},
                    "type": "object"
                  }
                }]
				}
		}
})
   .then(funnels => {
   			return funnels.users().login({email:'foo', password:'bar'})
   				.then(result =>{
   					var token = result.token;
   					return funnels.products(token).instances({itemsByPage:20})
   					  .then(products => {
   					  	 //etc
   					  })
   				});
   });
   
```

## developers

``npm test`` 

## roadmap

- [ ] auto authentication options
