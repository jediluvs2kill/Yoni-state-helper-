export interface YoniDefinition {
  id: number;
  domainName: string; // e.g., "Muladhara", "Liberated"
  levelName: string; // The descriptive name from the chart (Tamas, Instinct, etc.)
  soundHz: number;
  vibrationHz: number;
  pulseHz: number;
  colorClass: string;
}

export interface DomainGroup {
  name: string;
  level: string;
  yonis: YoniDefinition[];
}