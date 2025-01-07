class Visualiser {
  static drawNetwork(ctx, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;

    for(let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop = top + 
        lerp(
          height - levelHeight,
          0,
          network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
        );

      ctx.setLineDash([7, 4]);
      Visualiser.drawLevel(
        ctx, network.levels[i], 
        left, levelTop, 
        width, levelHeight, 
        i === 0, 
        i === network.levels.length - 1
          ? ['🢁', '🢀', '🢂', '🢃']
          : []
        );
    }

  }

  static drawLevel(ctx, level, left, top, width, height, isInput, outputLabels) {
    const right = left + width;
    const bottom = top + height;

    const {inputs, outputs, weights, biases} = level;
    
    //Draw the connections:
    for(let i = 0; i < inputs.length; i++) {
      for(let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(
          Visualiser.#getNodeX(inputs, i, left, right),
          bottom
        );
        ctx.lineTo(
          Visualiser.#getNodeX(outputs, j, left, right),
          top
        );
        ctx.lineWidth = 2;
        // TODO: Make the colour depending on the weight given? thermal scale?
          //So far B for negative weights, yellow for +ive? 
        ctx.strokeStyle = getRGBA(weights[i][j]);
        ctx.stroke();
      }
    }
    
    const nodeRadius = 18;
    // Draw the inputs level:
    for(let i = 0; i < inputs.length; i++) {
      const x = Visualiser.#getNodeX(inputs, i , left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();

      if(isInput) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'white';
        ctx.setLineDash([]);
        ctx.stroke();
      }
    }

    // Draw the outputs level:
    for(let i = 0; i < outputs.length; i++) {
      const x = Visualiser.#getNodeX(outputs, i , left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle ='black';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      // ctx.setLineDash([3, 3]);
      ctx.stroke();
      // ctx.setLineDash([]);

      if(outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = 'center';
        ctx.textBaseLine = 'middle';
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.font = (1.3 * nodeRadius) + 'px Arial'
        ctx.fillText(outputLabels[i], x, top+9);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLabels[i], x, top+9);
      }
    }
  }

  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}