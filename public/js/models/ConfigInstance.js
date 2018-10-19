var ConfigInstance = function (params) {
    this.instance = params.instance;
    this.wagonIndex = params.wagonIndex;
    this.wagonIndex = 2;
    this.operationIndex = 1;
    this.config = {
        "name": params.config.name,
        "cycleNumber": params.config.cycleNumber,
        "wagonNR": params.config.wagonNR,
        "parallelInstance": params.config.parallelInstance,
        "wagon": {
            "enabled": params.config.wagon.enabled,
            "name": params.config.wagon.name,
            "numOperations": params.config.wagon.numOperations,
            "operation": {
                "enabled": params.config.wagon.operation.enabled,
                "name": params.config.wagon.operation.name,
                "stdTime": params.config.wagon.operation.stdTime
            }
        }
    }
}