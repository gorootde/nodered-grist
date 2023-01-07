const {GristDocAPI} = require('grist-api');

module.exports = function(RED) {
    function RecordsNode(config) {
        RED.nodes.createNode(this,config);
        let node = this;
        this.document = RED.nodes.getNode(config.document);
        this.server = RED.nodes.getNode(config.server);
        this.table = config.tableId
        node.on('input', async function(msg, send, done) {
            const protocol=this.server.tlsEnabled ? "https" : "http";
            const url=protocol+"://"+this.server.hostname+":"+this.server.port;
            
            const api = new GristDocAPI(this.document.docid,{apiKey:this.server.apiKey,server:url});
            api.fetchTable(this.table).then(data => {
                node.send({payload:data,topic:this.table})
            }).catch(reason => done(reason,"Failed to perform grist request to "+url));
            
        });
    }
    RED.nodes.registerType("grist-records",RecordsNode);
}