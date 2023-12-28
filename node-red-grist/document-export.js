const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = function (RED) {
    function DocumentExportNode(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        this.document = RED.nodes.getNode(config.document);
        this.server = RED.nodes.getNode(config.server);
        this.format = config.format

        node.on('input', async function (msg, send, done) {
            const protocol = this.server.tlsEnabled === true ? "https" : "http";
            const url = protocol + "://" + this.server.hostname + ":" + this.server.port;

            var requestUrl;
            switch (this.format) {
                case "excel": requestUrl = `${url}/api/docs/${this.document.docid}/download`
                    break;
                case "sqlite": requestUrl = `${url}/api/docs/${this.document.docid}/download/xlsx`
                    break;
                default:
                    done("Unsupported format " + this.format);
            }

            fetch(requestUrl, {
                headers: {
                    'authorization': `Bearer ${this.server.apiKey}`
                }
            }).then(async (response) => {
                const blob = await response.blob()
                const arrayBuffer = await blob.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                node.send({ ...msg, payload: buffer })

            }).catch(reason => done(reason, "Failed to perform grist request to " + url));
        });
    }
    RED.nodes.registerType("grist-document-export", DocumentExportNode);
}