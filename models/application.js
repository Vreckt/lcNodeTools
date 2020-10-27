class ApplicationItem {

    constructor(name, path, port, description, startableFile = 'server') {
        this.name = name;
        this.path = path;
        this.port = port;
        this.descripiton = description;
        this.startableFile = startableFile;
        this.status = false;
    }

    switchStatus() { this.status = !this.status; }
}
module.exports = ApplicationItem;