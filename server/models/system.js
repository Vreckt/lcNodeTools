var configs = require('../configs.json');
// var os = require('os');
var osU = require('os-utils');

class System {
    constructor() { }

    static systemInformations(socket, os) {
        const cpu = os.cpus();
        setInterval(() => {
            osU.cpuUsage((v) => {
                let sys = {
                    os: {
                        platform: '',// os.type() + ' ' + os.arch()
                        release:  osU.platform(), // os.release() + ' ' +
                        uptime: osU.sysUptime()
                    },
                    cpu: {
                        model: cpu[0].model,
                        nbCore: osU.cpuCount(),
                        usage: v * 100,
                        free: 100 - (v * 100)
                    },
                    memory: {
                        total: Number(Number(osU.totalmem() / 1000).toFixed(2)),
                        free: Number(Number(osU.freemem() / 1000).toFixed(2)),
                        used: Number(Number((osU.totalmem() / 1000) - (Number(osU.freemem() / 1000))).toFixed(2)),
                        freeAvg: Number(Number(osU.freememPercentage() * 100).toFixed(2)),
                        usedAvg: Number(Number(100 - (osU.freememPercentage() * 100)).toFixed(2))
                    }
                };
                socket.emit('system-info', sys);
            });
        }, 1000);
    }
}
module.exports = System;