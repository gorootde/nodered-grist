const { GristDocAPI } = require('grist-api');
const mustache = require('mustache');
module.exports = function (RED) {
    function RecordsNode(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        this.document = RED.nodes.getNode(config.document);
        this.server = RED.nodes.getNode(config.server);
        this.table = config.tableId
        this.filter = config.filter

        node.on('input', async function (msg, send, done) {
            const protocol = this.server.tlsEnabled === true ? "https" : "http";
            const url = protocol + "://" + this.server.hostname + ":" + this.server.port;
            const filter = this.filter && this.filter !== "" ? JSON.parse(mustache.render(this.filter, { msg })) : undefined
            node.log(`filter evaluated to: ${JSON.stringify(filter)}`)
            const api = new GristDocAPI(this.document.docid, { apiKey: this.server.apiKey, server: url });
            api.fetchTable(this.table, filter).then(data => {
                node.send({ payload: data, topic: this.table })
            }).catch(reason => done(reason, "Failed to perform grist request to " + url));

        });
    }
    RED.nodes.registerType("grist-records", RecordsNode);
}