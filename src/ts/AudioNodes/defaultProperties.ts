export class DefaultProperties {
  static assign(nodeInput: AudioNode, nodeOutput: AudioNode) {
    console.assert(nodeInput instanceof AudioNode);
    console.assert(nodeOutput instanceof AudioNode);
    if (nodeInput == nodeOutput) {
      throw new Error("nodeInput and nodeOutput can not be the same AudioNode");
    }
    Object.assign(nodeInput, {
      connect: function () {
        console.log("override connect");
        return nodeOutput.connect.apply(
          nodeOutput,
          arguments as unknown as [AudioParam, number]
        );
      },
      disconnect: function () {
        console.log("override disconnect");
        return nodeOutput.disconnect.apply(
          nodeOutput,
          arguments as unknown as [AudioParam, number]
        );
      },
    });
  }
}
