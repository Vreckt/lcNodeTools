var express = require('express');
var path = require('path');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const { exec } = require("child_process");
const ApplicationItem = require('./models/application.js');
const ApplicationList = require('./models/applicationList.js');
const System = require('./models/system.js');
fs = require('fs');
var net = require('net');
var configs = require('./configs.json');
const multer  = require('multer');
const cors = require('cors');
app.use(cors());
app.options('*', cors());

var os = require('os');

const apps = new ApplicationList();
app.use(express.static(path.join(__dirname, 'html')));

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './apps/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

//will be using this for uplading
const upload = multer({ storage: storage });

app.post('/testUpload', upload.single('file'), function(req,res) {
    return res.send(req.file);
})

io.on('connection', (socket) => {
    apps.reset();
    const rawdata = fs.readFileSync('servers.json');
    if (rawdata) {
        for (const el of JSON.parse(rawdata)) {
            apps.addInList(el);
        }
    }

    socket.on('servers', () => {
        os.cpus()
        socket.emit('result', apps.list);
        listenStatusServer(socket);
        // systemInformations(socket);
        console.log('coucou');
        System.systemInformations(socket, os);
    });

    socket.on('update status', (el) => {
        apps.list.find(s => s.name == el.name).status = !el.status;
        socket.emit('result', apps.list);
        updateStatusFromServer(el, socket);
        saveServers(socket);
    });

    socket.on('delete', (el) => {
        apps.remove(apps.list.findIndex(a => a.name === el.name));
        saveServers(socket);
        socket.emit('result', apps.list);
    });

    socket.on('add server', (data) => {
        if (apps.list.find(s => s.name === data.name)) {
            socket.emit('errorss', `The application ${s.name} already exist`);
        } else {
            addApplication(data);
            saveServers(socket);
            socket.emit('result', apps.list);
        }
    });
});

http.listen(configs.appConfigurations.port, () => {
    console.log(`listening on *:${configs.appConfigurations.port}`);
});

function saveServers(socket) {
    fs.writeFile('servers.json', JSON.stringify(apps.list), function (err) {
        if (err) return console.log(err);
    });
    socket.emit('result', apps.list);
};

function updateStatusFromServer(server, socket) {
    let cmd = '';
    try {
        if (server.status) {
            cmd = `fuser -k ${server.port}/tcp`;
        } else {
            const path = `${server.path}`;
            cmd = `node ${path}/${server.startableFile}.js`
        }
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
            } else {
                saveServers(socket);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

function portInUse(port, callback) {
    var server = net.createServer((socket) => {
        socket.write('Echo server\r\n');
        socket.pipe(socket);
    });

    server.listen(port, '127.0.0.1');
    server.on('error', (e) => {
        callback(true);
    });
    server.on('listening', (e) => {
        server.close();
        callback(false);
    });
};

function addApplication(data) {
    apps.addInList(
        new ApplicationItem(data.name, data.path, data.port, data.startableFile)
    );
}

function listenStatusServer(socket) {
    setInterval(() => {
        for (const server of apps.list) {
            portInUse(server.port, function (returnValue) {
                if (server.status !== returnValue) {
                    server.status = returnValue;
                    socket.emit('result', apps.list);
                }
            });
        }
    }, configs.appConfigurations.intervalCheckPort);
}