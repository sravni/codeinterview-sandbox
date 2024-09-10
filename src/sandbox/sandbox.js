const util = require('util');
const exec = util.promisify(require('child_process').exec);

const path = require('path');
const fs = require('fs');
const fsP = require('fs').promises;
const crypto = require('crypto');
const { LANGUAGE_EXECUTE_PARAMETERS } = require('../consts');

class Sandbox {
    constructor(options) {
        this.timeout = options.timeout || 10 * 1000;

        const parameters = LANGUAGE_EXECUTE_PARAMETERS[options.language];

        this.dir = path.normalize(path.join(process.cwd(), options.dir, this.#random(10)));
        this.executeString = parameters.executeString;
        this.codeFilePath = path.join(this.dir, parameters.fileName);
    }

    async execute(code) {
        const response = {
            output: null,
            error: null,
            duration: null,
        }

        try {
            await this.#prepare();

            const { output, error, duration } = await this.#execute(code);

            response.output = output;
            response.error = this.#convertError(error);
            response.duration = duration;
        } catch (error) {
            response.error = this.#convertError(error);
        } finally {
            this.#cleanup()
        }

        return response;
    }

    async #prepare() {
        if (!fs.existsSync(this.dir)){
            await fsP.mkdir(this.dir, { recursive: true });
        }

        console.log(
            JSON.stringify({
                level: 'info',
                message: `"${this.dir}" was created`,
            })
        );

        await fsP.writeFile(this.codeFilePath, "");

        console.log(
            JSON.stringify({
                level: 'info',
                message: `"${[this.codeFilePath].join(', ')}" was created`,
            })
        );
    }

    async #execute(code) {     
        const command = `cd ${this.dir} && ${this.executeString}`;

        console.log(
            JSON.stringify({
                level: 'info',
                message: `Execute command - "${command}"`,
            })
        )

        await fsP.writeFile(this.codeFilePath, code);

        console.log(
            JSON.stringify({
                level: 'info',
                message: `Code added to "${this.codeFilePath}"`,
            })
        )

        const startTime = Date.now();
        const { stdout, stderr } = await exec(command, { timeout: this.timeout });
        const duration = Date.now() - startTime;

        console.log(
            JSON.stringify({
                level: 'info',
                message: `Code executed`,
                output: stdout,
                duration,
            })
        )        

        return  { output: stdout, error: stderr, duration }
    }

    #random(size) {
        return crypto.randomBytes(size).toString('hex')
    }
    
    #convertError(error) {
        const dirRegExp = new RegExp(this.dir, 'g')

        if (error === null)
            return null;

        if (typeof error === 'string') {
            return error.replace(dirRegExp, '')
        }

        console.error(
            JSON.stringify({
                level: 'error',
                message: error.message,
                exception: {
                    message: error.message,
                    stack: error.stack,
                    signal: error.signal,
                }
            })
        )

        return error.toString().replace(dirRegExp, '')
    }

    #cleanup() {
        fs.rmSync(this.dir, { recursive: true, force: true });

        console.log(
            JSON.stringify({
                level: 'info',
                message: `"${this.dir}" was deleted`,
            })
        );
    }
};

module.exports = Sandbox;