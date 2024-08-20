export class DefaultProperties {
  static assign(nodeInput: AudioNode, nodeOutput: AudioNode) {
    if (nodeInput == nodeOutput) {
      throw new Error("nodeInput and nodeOutput can not be the same AudioNode");
    }
    Object.assign(nodeInput, {
      output: nodeOutput,
      connect: function (
        destinationNode: AudioNode,
        output?: number,
        input?: number
      ) {
        return nodeOutput.connect(destinationNode, output, input);
      },
      disconnect: function () {
        return nodeOutput.disconnect.apply(
          nodeOutput,
          arguments as unknown as [AudioParam, number]
        );
      },
    });
  }
}
