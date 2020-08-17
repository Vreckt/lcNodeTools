class ApplicationList {
    appsList;

    constructor() {
        this.appsList = [];
    }

    addInList(el) { 
        this.appsList.push(el);
        return this.appsList;
    }

    remove(index) { 
        this.appsList.splice(index, 1);
        return this.appsList;
    }

    get list() { return this.appsList.slice(); }
    reset() {this.appsList = []; }
}

module.exports = ApplicationList;
