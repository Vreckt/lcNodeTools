var socket = io();
const addServer = document.getElementById('add');
const createForm = document.getElementById('create-form');
const create = document.getElementById('create');
const iname = document.getElementById('iname');
const ipath = document.getElementById('ipath');
const istartableFile = document.getElementById('istartableFile');
const iautoRestart = document.getElementById('iautoRestart');
const iport = document.getElementById('iport');
const listApps = document.getElementById('listServer');

createForm.style.display = 'none';
add.addEventListener('click', () => {
    createForm.style.display = createForm.style.display === 'none' ? 'block' : 'none' ;
    add.textContent = createForm.style.display === 'none' ? 'Add' : 'Cancel';
});

create.addEventListener('click', () => {
    socket.emit('add server', (
        { 
            name: iname.value,
            path: ipath.value,
            port: iport.value,
            startableFile: iStartableFile.value,
        }
    ));
});

socket.emit('servers');

setTimeout(() => {
    socket.emit('servers');
}, 200);

socket.on('result', (data) => {
    while(listApps.firstChild) { 
        listApps.removeChild(listApps.firstChild); 
    }
    if (data) {
        for (const el of data) {
            const element = this.renderServer(el, socket);
            document.getElementById('listServer').appendChild(element);
        }
    }
    const userSelection = document.getElementsByClassName('u-status');
    for (var i = 0; i < userSelection.length; i++) {
        (function (index) {
            userSelection[index].addEventListener("click", function () {
                socket.emit('update status', data[index]);
            })
        })(i);
    }
});
socket.on('system-info', (system) => { 
    console.log(system);
    // OS
    const platform = document.getElementById('platform');
    const version = document.getElementById('version');
    const uptime = document.getElementById('uptime');
    platform.textContent = `${system.os.platform} --- ${system.os.release}`;
    version.textContent = system.os.version;
    var hours = Math.floor(system.os.uptime / 60 / 60);
    var minutes = Math.floor(system.os.uptime / 60) - (hours * 60);
    var seconds = system.os.uptime % 60;
    uptime.textContent = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    
    // CPU
    const model = document.getElementById('model');
    const cpu_usage = document.getElementById('cpu-usage');
    const usage_avg = document.getElementById('cpu-usage-avg');
    const usage_per = document.getElementById('cpu-usage-per');
    model.textContent = `${system.cpu.model}`;
    usage_avg.style.width = `${Math.round(system.cpu.usage)}%`;
    usage_per.textContent = `${Math.round(system.cpu.usage)}%`;

    // Memory
    const memUsage = document.getElementById('memory-usage');
    const memUsageAvg = document.getElementById('memory-usage-avg');
    const memUsagePer = document.getElementById('memory-usage-per');
    memUsageAvg.style.width = `${100 - system.memory.freeAvg}%`;
    memUsagePer.textContent = `${system.memory.used} / ${system.memory.total}GB (${system.memory.usedAvg}%)`;
});

socket.on('errorss', (msg) => { console.log(msg); });

function deleteElement(element, socket) {
    socket.emit('delete', element);
}

function renderServer(el, socket) {
    const elStatus = document.createElement('div');
    elStatus.setAttribute('class', `u-status el-status ${el.status ? 'on' : 'off'}`);
    const elName = document.createElement('div');
    elName.textContent = `${el.name}`;
    elName.setAttribute('class', `el-name`);

    const elStartFile = document.createElement('div');
    elStartFile.textContent = `${el.startableFile}`;
    elStartFile.setAttribute('class', `el-startable-file`);
    

    const elAction = document.createElement('div');
    elAction.setAttribute('class', `el-Action`);


    const elBtnDelete = document.createElement('button');
    elBtnDelete.setAttribute('class', 'btn btn-delete');
    elBtnDelete.textContent = 'X';
    elBtnDelete.addEventListener("click", () => {
        var confirm = prompt("Please write CONFIRM to delete the app");
        if (confirm && confirm === 'CONFIRM') {
            socket.emit('delete', el);
        }
    });
    elAction.appendChild(elBtnDelete);

    const element = document.createElement('div');
    element.setAttribute('class', 'serv-el');
    element.appendChild(elStatus);
    element.appendChild(elName);
    element.appendChild(elStartFile);
    element.appendChild(elAction);
    return element;
}