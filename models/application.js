class ApplicationItem {
    descripiton;
    startableFile;
    status;

    constructor(name, path, port, startableFile = 'server') {
        this.name = name;
        this.path = path;
        this.port = port;
        this.descripiton = '';
        this.startableFile = startableFile;
        this.status = false;
    }

    switchStatus() { this.status = !this.status; }
}
module.exports = ApplicationItem;