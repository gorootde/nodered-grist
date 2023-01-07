module.exports = function(RED) {
    function ServerNode(n) {
        RED.nodes.createNode(this,n);
        this.hostname = n.hostname;
        this.port = n.port;
        this.tlsEnabled = n.tlsEnabled;
        this.apiKey = n.apiKey

    }
    RED.nodes.registerType("grist-server",ServerNode);
}