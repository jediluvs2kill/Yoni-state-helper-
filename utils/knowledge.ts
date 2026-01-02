export const getKnowledge = (yoniId: number, domain: string) => {
  // calculate position 1-12 within the domain
  const position = ((yoniId - 1) % 12) + 1;
  
  const STAGES = [
    { title: "Inception", desc: "The point of entry. A singular focus where the frequency first touches the nervous system." },
    { title: "Polarity", desc: "The emergence of contrast. Sensing the vibration against the stillness of the body." },
    { title: "Gathering", desc: "Accumulation of potential. The rhythm begins to saturate local awareness." },
    { title: "Structure", desc: "Formation of stability. The mind recognizes the pattern and locks into the carrier tone." },
    { title: "Projection", desc: "Active expansion. The state pushes outwards, testing the boundaries of perception." },
    { title: "Friction", desc: "The crucible of heat. Internal resistance arises as the pulse challenges dissonance." },
    { title: "Equilibrium", desc: "The balance point. Resistance fades; the vibration and the observer move in phase." },
    { title: "Resonance", desc: "Deep amplification. The signal reflects internally, creating a self-sustaining loop." },
    { title: "Complexity", desc: "Layered perception. Nuances of the ratio reveal deeper textures within the state." },
    { title: "Refinement", desc: "Crystalization of intent. The noise drops away, leaving only the pure signal." },
    { title: "Dissolution", desc: "The fading of boundaries. The distinction between the sensor and the signal evokes a void." },
    { title: "Integration", desc: "Complete lock. The state is fully mapped to somatic memory, ready for recall." }
  ];

  const DOMAIN_CONTEXT: Record<string, string> = {
    "Muladhara": "Grounding this in the physical stability of the Root.",
    "Svadhisthana": "Flowing through the instinctual waters of the Sacral.",
    "Manipura": "Igniting the autonomous will of the Solar Plexus.",
    "Anahata": "Balancing within the expansive bridge of the Heart.",
    "Vishuddha": "Resonating through the cognitive truth of the Throat.",
    "Ajna": "Clarifying the inner vision of the Third Eye.",
    "Sahasrara": "Dissolving into the liberated unity of the Crown."
  };

  const stage = STAGES[position - 1];
  const context = DOMAIN_CONTEXT[domain] || "Within the matrix of consciousness.";

  return {
    stageTitle: `${stage.title} of ${domain}`,
    description: `${stage.desc} ${context}`
  };
};