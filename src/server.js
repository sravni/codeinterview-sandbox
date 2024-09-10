const dotenv = require('dotenv');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const Sandbox = require('./sandbox/sandbox');
const { LANGUAGES } = require('./consts');
const swaggerDocument = require('./swagger.json');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/internal/liveness', (_, res) => {
    res.status = 200;
    res.json({ message: 'OK' });
});

app.get('/internal/readiness', (_, res) => {
    res.status = 200;
    res.json({ message: 'OK' });
});

app.post('/execute', async (request, response) => {
    const {
        language,
        code,
    } = request.body;

    if (typeof language !== "string") {
        response.status = 400;
        response.json(new Error("language must be string"));
        return;
    }

     if (typeof code !== "string") {
        response.status = 400;
        response.json(new Error("code must be string"));
        return;
     }
    
    if (!Object.values(LANGUAGES).includes(language)) {
        response.status = 400;
        response.json(new Error(`${language} is not available for execute.`));
        return;
    }

    const sandbox = new Sandbox({
        dir: './tmp',
        language,
        timeout: process.env.SANDBOX_TIMEOUT ? parseInt(process.env.SANDBOX_TIMEOUT, 10) : 10 * 1000
    });

    // { output: string | null, error: string | null, duration: number | null }
    const result = await sandbox.execute(code);

    response.json(result);
});

app.get('/swagger-json', (_, res) => res.json(swaggerDocument));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})