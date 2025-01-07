class NeuralNetwork {
  constructor(neruonCounts) {
    this.levels = [];
    for(let i = 0; i < neruonCounts.length - 1; i++) {
      this.levels.push(new Level(neruonCounts[i], neruonCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for(let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);

    this.biases = new Array(outputCount);
    this.weights = [];
    for(let i = 0; i < this.inputs.length; i++) {
      this.weights[i] = new Array(outputCount);
    }
    
    Level.#randomise(this);
  }

  /**
   * Randomise weights and biases to (-1, 1) range.
   * @param {class} level 
   */
  static #randomise(level) {
    for(let i = 0; i < level.inputs.length; i++) {
      for(let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for(let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  /**
   * Feed forward algo: pass on the given inputs, and calculate the output for each.
   * @param {*} givenInputs 
   * @param {*} level 
   */
  static feedForward(givenInputs, level) {
    for(let i = 0; i < givenInputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    for(let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for(let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      level.outputs[i] = (sum > level.biases[i])  ? 1 : 0;
    }
    return level.outputs;
  }
}