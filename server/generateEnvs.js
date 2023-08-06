const fs = require('fs');
const path = require('path');

const TYPES_PATH = 'src/global.d.ts';

const toAbsolute = (...paths) => path.resolve(__dirname, ...paths);

const env = fs
    .readFileSync(toAbsolute('.env'), 'utf-8')
    ?.replace(/^(#.*)$/g, '')
    .split('\n')
    .map((el) => {
        try {
            const name = el.match(/.*(?==)/)?.[0];

            if (/\s/g.test(name)) {
                throw new Error(`${name} is not a valid environment variable`);
            }

            return name && `"${name}"`;
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    })
    .filter(Boolean);

const envNames = env?.join(' | ');

const template = `
declare namespace NodeJS {
   interface ProcessEnv ${
       envNames.length > 0 ? `extends Record<${envNames}, string> {}` : '{}'
   } 
}
`;

fs.writeFileSync(toAbsolute(TYPES_PATH), template, 'utf-8');
