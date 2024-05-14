const express = require('express')
const axios = require('axios')
var xmlparser = require('express-xml-bodyparser');
var xml2js = require('xml2js');


const app = express()
const port = 3000

app.use(express.json());
app.use(xmlparser({explicitRoot: false, explicitArray: false}));


// Custom middleware for logging
app.use((req, res, next) => {
    // Log incoming message
    const incomingLog = {
        type: "messageIn",
        method: req.method,
        path: req.url,
        body: req.rawBody? req.rawBody : req.body, // rawbody for xml
        dateTime: new Date(Date.now()).toISOString(),
    };
    console.log(incomingLog);


    // Buffer the original send method
    const originalSend = res.send;
    let responseBody;
    res.send = function (body) {
        responseBody = body;
        originalSend.call(this, body);
    };

    // Log outgoing message
    res.on('finish', () => {
        const outgoingLog = {
            type: "messageOut",
            dateTime: new Date(Date.now()).toISOString(),
            body: responseBody,
            fault: res.locals.errorStack? res.locals.errorStack : ''
        };
        console.log(outgoingLog);
    });

    next()

});

// build xml or json as needed
function parseObj(res, code, results, xml){
    if(xml) {
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(results);
        res.status(code).set('Content-Type', 'application/xml').send(xml);
    } 
    else {
        res.status(code).json(results);
    }
}


// Fetch products from the online API
async function fetchProducts(query, limit, skip) {
    const response = await axios.get('https://dummyjson.com/products/search', {
        params: {
            q: query,
            skip: skip,
            limit: limit
        }
    });
    return response.data;
}

// Route handler for your API endpoint
app.post('/products', async (req, res, next) => {
    const { query, page } = req.body;

    // Validate query parameter
    if (!query || typeof query !== 'string' || query.length < 3 || query.length > 10) {
        const error = new Error('Invalid or missing query parameter.');
        error.statusCode = 400;
        return next(error);
    }

    const pageNumber = page ? parseInt(page) : 1;
    if (isNaN(pageNumber) || pageNumber < 1) {
        const error = new Error('Invalid page parameter.');
        error.statusCode = 400;
        return next(error);
    }

    // Fetch products from web
    try {
        const limit = 2;
        const skip = (pageNumber - 1) * limit;
        const response = await fetchProducts(query, limit, skip);
        const { products, total } = response;

        // Ensure that the requested page exists
        const pageCount = Math.ceil(total / limit);
        if (pageNumber > pageCount) {
            const error = new Error('Requested page does not exist.');
            error.statusCode = 404;
            return next(error);
        }

        // Extract required fields from products
        const results = products.map(product => {
            const finalPrice = parseFloat((product.price * (1 - product.discountPercentage / 100)).toFixed(2));
            return {
                title: product.title,
                total_price: finalPrice,
                description: product.description
            };
        });

        parseObj(res, 200, results, req.is('application/xml'))
        
    } catch (error) {
        next(error);
    }
});

// Custom error handling middleware
app.use((err, req, res, next) => {
    res.locals.errorStack = err.stack;
    const results = { 'code': err.statusCode, 'message': err.message }
    parseObj(res, err.statusCode, results, req.is('application/xml'))
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
