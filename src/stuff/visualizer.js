/**
 * Audio Spectrum Visualizer for PlayVer
 * Web Audio API AnalyserNode with Fallback Procedural Waveform
 */

export class AudioVisualizer {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.audioCtx = null;
    this.analyser = null;
    this.sourceNode = null;
    this.dataArray = null;
    this.connectedMedia = null;
    this.animId = null;
    this.isPlaying = false;
    this.isSynthetic = false;
    this.phase = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = (rect.width || 360) * dpr;
    this.canvas.height = (rect.height || 100) * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width || 360;
    this.height = rect.height || 100;
  }

  connectMedia(mediaElement) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      if (this.connectedMedia !== mediaElement) {
        if (!mediaElement.__visualizerNode) {
          mediaElement.crossOrigin = 'anonymous';
          this.analyser = this.audioCtx.createAnalyser();
          this.analyser.fftSize = 64;
          this.analyser.smoothingTimeConstant = 0.8;
          
          try {
            this.sourceNode = this.audioCtx.createMediaElementSource(mediaElement);
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);
            mediaElement.__visualizerNode = this.sourceNode;
            this.isSynthetic = false;
          } catch (e) {
            // If cross-origin restrictions apply, fallback to procedural audio visualizer
            this.isSynthetic = true;
          }
        }
        this.connectedMedia = mediaElement;
      }
      const bufferLength = this.analyser ? this.analyser.frequencyBinCount : 32;
      this.dataArray = new Uint8Array(bufferLength);
    } catch (e) {
      this.isSynthetic = true;
    }
  }

  start(mediaElement) {
    if (mediaElement) {
      this.connectMedia(mediaElement);
    }
    this.isPlaying = true;
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.loop();
  }

  stop() {
    this.isPlaying = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.clear();
  }

  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  loop() {
    if (!this.isPlaying) return;

    this.render();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  render() {
    const { ctx, width, height } = this;
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const barCount = 28;
    const barWidth = (width / barCount) - 3;
    this.phase += 0.08;

    if (this.analyser && !this.isSynthetic) {
      try {
        this.analyser.getByteFrequencyData(this.dataArray);
      } catch (e) {
        this.isSynthetic = true;
      }
    }

    for (let i = 0; i < barCount; i++) {
      let percent = 0;

      if (!this.isSynthetic && this.dataArray) {
        const dataIdx = Math.floor(i * (this.dataArray.length / barCount));
        percent = (this.dataArray[dataIdx] || 0) / 255;
      } else {
        // High quality synthetic dancing spectrum waveform
        const wave1 = Math.sin(this.phase + i * 0.35) * 0.35 + 0.35;
        const wave2 = Math.cos(this.phase * 1.5 + i * 0.2) * 0.2 + 0.2;
        percent = Math.min(1, Math.max(0.08, wave1 + wave2));
      }

      const barHeight = Math.max(4, percent * (height - 12));
      const x = i * (barWidth + 3);
      const y = height - barHeight;

      // Neon Gradient
      const grad = ctx.createLinearGradient(0, height, 0, 0);
      grad.addColorStop(0, '#06b6d4');
      grad.addColorStop(0.5, '#8b5cf6');
      grad.addColorStop(1, '#ec4899');

      ctx.fillStyle = grad;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#06b6d4';
      
      // Rounded bar top
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();

      // Peak Cap Dot
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#ffffff';
      ctx.fillRect(x, Math.max(0, y - 4), barWidth, 2);
    }
  }
}
