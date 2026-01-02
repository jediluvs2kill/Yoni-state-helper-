class AudioEngine {
  private context: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private pulseOscillator: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private pulseGain: GainNode | null = null;
  private vibrationInterval: number | null = null;

  constructor() {
    // We defer initialization to user interaction policy
  }

  public init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  public startSession(frequency: number, pulseRate: number, vibrationHz: number) {
    this.init();
    if (!this.context) return;

    const now = this.context.currentTime;

    // 1. Create Nodes
    this.oscillator = this.context.createOscillator();
    this.pulseOscillator = this.context.createOscillator();
    this.masterGain = this.context.createGain();
    this.pulseGain = this.context.createGain();

    // 2. Configure Carrier Tone (Pure Sine for precision)
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = frequency;

    // 3. Configure LFO (Low Frequency Oscillator) for the Pulse (AM Synthesis)
    // The pulse rate dictates the rhythmic "alive" feeling.
    this.pulseOscillator.type = 'sine';
    this.pulseOscillator.frequency.value = pulseRate;

    // 4. Connect Graph
    // Logic: PulseOsc -> PulseGain.gain (modulates volume) -> MasterGain -> Destination
    
    // Set base gain for the carrier
    // We want the pulse to oscillate between, say, 0.3 and 1.0 amplitude
    // To do this via WebAudio AM:
    // Carrier -> PulseGain (modulated by LFO) -> MasterGain -> Out
    
    this.pulseOscillator.connect(this.pulseGain.gain);
    
    // We offset the pulse gain so it doesn't go silent, but throbs
    // Gain value = 0.6 + (0.4 * sine wave)
    this.pulseGain.gain.value = 0.7; // Base volume
    
    this.oscillator.connect(this.pulseGain);
    this.pulseGain.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);

    // 5. Envelope (Attack)
    // Attack: 1s fade in to prevent clicking and induce calm
    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(0.8, now + 1.5); // 1.5s Attack

    // 6. Start Oscillators
    this.oscillator.start(now);
    this.pulseOscillator.start(now);

    // 7. Haptics (Vibration)
    // Standard Mobile API cannot do specific Hz (e.g. 28Hz). 
    // It is a motor on/off.
    // However, we can map the "Pulse" to the vibration rhythm.
    // The "Vibration Hz" in the spec serves as a conceptual frequency anchor, 
    // but practically we implement the *Pulse Layer* rhythm via haptics.
    // Pulse Hz = pulses per second.
    this.startHaptics(pulseRate);
  }

  private startHaptics(pulseHz: number) {
    if (!navigator.vibrate) return;

    // Calculate duration of one cycle in ms
    const cycleDuration = 1000 / pulseHz;
    // We want a distinct tactile band. 
    // Let's do a sharp pulse: 30% on, 70% off
    const vibrateTime = Math.floor(cycleDuration * 0.4); 
    const pauseTime = Math.floor(cycleDuration * 0.6);

    // Initial vibration
    navigator.vibrate(vibrateTime);

    // Loop
    this.vibrationInterval = window.setInterval(() => {
      navigator.vibrate(vibrateTime);
    }, vibrateTime + pauseTime);
  }

  public stopSession() {
    if (this.context && this.masterGain) {
      const now = this.context.currentTime;
      // Release: 1.5s fade out
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0, now + 1.0);

      const stopTime = now + 1.0;
      
      if (this.oscillator) {
        this.oscillator.stop(stopTime);
        this.oscillator = null;
      }
      if (this.pulseOscillator) {
        this.pulseOscillator.stop(stopTime);
        this.pulseOscillator = null;
      }
    }

    if (this.vibrationInterval) {
      clearInterval(this.vibrationInterval);
      this.vibrationInterval = null;
      if (navigator.vibrate) navigator.vibrate(0);
    }
  }
}

export const audioEngine = new AudioEngine();