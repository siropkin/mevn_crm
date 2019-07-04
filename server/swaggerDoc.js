const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'Fullstack VUE Express App with Swagger',
        },
        basePath: '/api',    
    },
    //apis: ['./server/api/routes/providers.js', './server/api/routes/clients.js'],
    apis: ['./server/swagger.yaml']
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));   
}