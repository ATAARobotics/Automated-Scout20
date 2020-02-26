const fs = require("fs");

const cache = new NodeCache();

const FRC = 'https://frc-api.firstinspires.org/v2.0/';
const API_KEY = fs.readFileSync('FRC_API_KEY', "utf8");

module.exports = {
    get: async (path) => {
        var options = {
            headers: {
                'Authorization': API_KEY,
                'If-Modified-Since': cache.get(`${path}-time`)
            }
        };
        var response = {};
        response = await fetch(`${FRC}${path}`, options).catch(err => response.ok = "NO");
        if (response.status == 200) {
            var info = await response.json();
            cache.set(`${path}`, info);
            cache.set(`${path}-time`, response.headers.get('last-modified'));
            console.log('Getting data from FRC API...');
            return info;
        } else if (response.status == 304) {
            console.log('Using cached, unchanged.');
            return cache.get(`${path}`);
        } else if (response.status == 404) {
            console.error("Invalid path");
        } else if (!response.ok) {
            console.error('FRC API Fetch error. Using cached if exists')
            return cache.get(`${path}`);
        }
    },
    clearCache: async () => {
        cache.flushAll();
        var cacheStats = cache.getStats();
        return cacheStats;
    },
    cacheStats: async () => {
        var cacheStats = cache.getStats();
        return cacheStats;
    },
    cacheKeys: async () => {
        var keys = cache.keys();
        return keys;
    }
};
