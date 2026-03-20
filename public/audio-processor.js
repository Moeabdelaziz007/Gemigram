/**
 * 🎙️ Aether Neural Spine PCM Processor
 * 
 * High-performance AudioWorklet for zero-latency Bidi streaming.
 */

class NeuralSpineProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input[0]) {
      const channelData = input[0];
      // Send chunks as Float32Array
      this.port.postMessage({
        type: 'audio_chunk',
        payload: new Float32Array(channelData)
      });
      
      // Pass-through to output if needed
      const output = outputs[0];
      if (output && output[0]) {
        output[0].set(channelData);
      }
    }
    return true;
  }
}

registerProcessor('neural-spine-processor', NeuralSpineProcessor);
