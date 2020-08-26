/* 
 * Primary file for API
 *
 *
 */

 // Dependencies
 var http = require('http');
 var url = require('url');
const { StringDecoder } = require('string_decoder');
 var StrignDecoder = require('string_decoder').StringDecoder;

 // the server should response to all requests with a string
 var server = http.createServer(function(req,res){
    // get url and parse it
    var parsedUrl = url.parse(req.url,true)
    
    // get path from url
    var path = parsedUrl.pathname;
    // regex replace and leading OR trailing /'s with nothing
    var trimmedPath = path.replace(/^\/+|\/+$/g,"")

    // get query string as an object
    var queryStringObject = parsedUrl.query

    // get http method
    var method = req.method.toLowerCase()

    // get the headers as an object
    var headers = req.headers;


    // get payload
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        buffer += decoder.end();

        // chose the handler this request should go to. if one does not exist then chose notFound handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound ;
        // construct data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data,function(statusCode, payload){
            // use status code called back by the handler or default to 200
            
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        
            // use the payload called back by the handler or default to empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // convert payload to string
            var payloadString = JSON.stringify(payload);
            
            // return response
            res.writeHead(statusCode);
            res.end(payloadString);
            // log the request path
            console.log('returning this response',statusCode,payloadString);
        });



        // log the requested path 
/*      console.log('Request received on path:[ '+trimmedPath+' ] with method :[ '+method+' ] has query string : ',queryStringObject );
        console.log('Request receoved with these headers [ ',headers,' ]');
        console.log('Request receoved with this payload [ ',buffer,' ] having length',buffer.length);
*/
       });



});

//  Start server and have it listen to port 3000
server.listen(3000,function(){
    console.log("The server is listening on port 3000 now...");
});

// define the handlers
var handlers = {};

// Sample handler
handlers.sample = function(data,callback){
    // callback a http status code and the payload 
    callback(406,{'name' : 'sample handler'});
};

// not found handler
handlers.notFound = function(data,callback){
    callback(404);
};

var router = {
    'sample': handlers.sample
}
