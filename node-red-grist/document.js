module.exports = function(RED) {
    function DocumentNode(n) {
        RED.nodes.createNode(this,n);
        this.docid = n.docid;
        this.name = n.name;
    }
    RED.nodes.registerType("document",DocumentNode);
}