const { GristDocAPI } = require('grist-api');
const mustache = require('mustache');
module.exports = function (RED) {
    function UpdateRecordsNode(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        this.document = RED.nodes.getNode(config.document);
        this.server = RED.nodes.getNode(config.server);
        this.table = config.tableId

        node.on('input', async function (msg, send, done) {
            const protocol = this.server.tlsEnabled === true ? "https" : "http";
            const url = protocol + "://" + this.server.hostname + ":" + this.server.port;
            const api = new GristDocAPI(this.document.docid, { apiKey: this.server.apiKey, server: url });
            const data = Array.isArray(msg.payload) ? msg.payload : [msg.payload]

            api.updateRecords(this.table, data).then(data => {
                node.send({ ...msg, payload: data })
            }).catch(reason => done(reason, "Failed to perform grist request to " + url));

        });
    }
    RED.nodes.registerType("grist-update-records", UpdateRecordsNode);
}