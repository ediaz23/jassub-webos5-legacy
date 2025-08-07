
import compat from 'eslint-plugin-compat'
import globals from 'globals'


export default [{
    files: ['src/**/*.js'],
    languageOptions: {
        globals: {
            ...globals.browser,
        },
        ecmaVersion: 2022,
        sourceType: 'module',
        parserOptions: {
            parser: '@babel/eslint-parser',
            requireConfigFile: false,
        },
    },

    rules: {
        'no-caller': 2,
        'no-undef': 2,
        'no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: true,
                caughtErrors: 'none', // Allow unused variables in catch blocks
                varsIgnorePattern: '^_',
                argsIgnorePattern: '^_'
            }
        ],
        'no-use-before-define': 0,
        strict: 0,
        'no-loop-func': 0,
        'no-multi-spaces': 'error',

        'keyword-spacing': ['error', {
            before: true,
            after: true,
        }],

        quotes: ['error', 'single', {
            allowTemplateLiterals: true,
        }],

        indent: ['error', 4, {
            SwitchCase: 1,
        }],

        curly: ['error', 'all'],

        'space-infix-ops': ['error', {
            int32Hint: true,
        }],
    },
}, {
    files: ['build/js/modern/worker.debug.js'],
    languageOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        globals: {
            ...globals.worker,
        },
    },
    plugins: {
        compat,
    },
    rules: {
        'compat/compat': 'error',
    },
    settings: {
        browsers: ['Chrome 68'],
    },
}, {
    files: ['build/js/legacy/worker.debug.js'],
    languageOptions: {
        ecmaVersion: 5,
        sourceType: 'script',
        globals: {
            ...globals.worker,
        },
    },
    plugins: {
        compat,
    },
    rules: {
        'compat/compat': 'error',
    },
    settings: {
        browsers: ['Chrome 38'],
    },
}];
