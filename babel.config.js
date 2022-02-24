const config = function config(api) {
    api.cache(true);
    return {
        plugins: [],
        presets: [
            ['@babel/preset-env', { targets: { node: '8.10' } }],
        ],
    };
};
module.exports = config;
