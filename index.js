const express = require('express')
const axios = require('axios')
const xmlparser = require('express-xml-bodyparser')
const xml2js = require('xml2js')

const app = express()
const port = 3000
const url = 'https://dummyjson.com/products/search'

app.use(express.json())
app.use(xmlparser({explicitRoot: false, explicitArray: false}))


// build error code and message
const buildError = (code=400, msg='Bad Request response.') => {
    const error = new Error(msg)
    error.statusCode = code
    return error
}

// build xml or json response as needed
const buildObject = (req, res, code, results) => {
    try {
        if(req.accepts('json')) {
            res.status(code).json(results)
        } else {
            var builder = new xml2js.Builder()
            var xml = builder.buildObject(results)
            res.status(code).set('Content-Type', 'application/xml').send(xml)
        }
    } catch (err) {
        throw buildError(500, 'Internal server error.') // error while building object
    }
}

// fetch products from server
const fetchProducts = async (query, limit, skip) => {
    try {
        const response = await axios.get(url, {
            params: {
                q: query,
                skip: skip,
                limit: limit
            }
        })
        return response.data
    } catch (err) {
        throw buildError(500, 'Internal server error.') // error while fetching
    }
}


// middleware for logging
app.use((req, res, next) => {
    // log incoming
    const incomingLog = {
        type: 'messageIn',
        method: req.method,
        path: req.url,
        body: req.rawBody? req.rawBody : req.body, // rawbody for xml
        dateTime: new Date(Date.now()).toISOString(),
    }
    console.log(incomingLog)

    // buffer original send method
    const originalSend = res.send
    let responseBody
    res.send = function (body) {
        responseBody = body
        originalSend.call(this, body)
    }

    // log outgoing
    res.on('finish', () => {
        const outgoingLog = {
            type: 'messageOut',
            dateTime: new Date(Date.now()).toISOString(),
            body: responseBody,
            fault: res.locals.errorStack? res.locals.errorStack : ''
        }
        console.log(outgoingLog)
    })

    next()
});

// route handler for / endpoint
app.post('/', async (req, res, next) => {
    try {
        // validate request parameters
        const { query, page } = req.body
        if (!query || typeof query !== 'string' || query.length < 3 || query.length > 10) {
            return next(buildError()) // invalid query parameter
        }
    
        const pageNumber = page ? parseInt(page) : 1
        if (isNaN(pageNumber) || pageNumber < 1) {
            return next(buildError()) // invalid page parameter
        }

        // fetch products
        const limit = 2
        const skip = (pageNumber - 1) * limit
        const response = await fetchProducts(query, limit, skip)
        const { products, total } = response
        const pageCount = Math.ceil(total / limit)
        
        if (pageNumber > pageCount) {
            return next(buildError()) // page doesnt exist
        }

        const results = products.map(product => {
            return {
                title: product.title,
                final_price: parseFloat((product.price * (1 - product.discountPercentage / 100)).toFixed(2)),
                description: product.description
            }
        })

        buildObject(req, res, 200, results)
        
    } catch (err) {
        next(err)
    }
});

// middleware to handle requests for undefined routes
app.use((req, res, next) => {
    return next(buildError())
})

// error handling middleware
app.use((err, req, res, next) => {
    res.locals.errorStack = err.stack
    const results = { 'code': err.statusCode, 'message': err.message }
    buildObject(req, res, err.statusCode, results)
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
