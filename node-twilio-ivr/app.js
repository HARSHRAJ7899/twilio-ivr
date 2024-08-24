require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ivrRoutes = require('./routes/ivrRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'IVR API',
            version: '1.0.0',
            description: 'API documentation for IVR system',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./routes/ivrRoutes.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/ivr', ivrRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Twilio IVR Service!');
});

app.use(errorHandler)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
