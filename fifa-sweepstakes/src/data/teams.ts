import type { Team } from '../types';

export const TEAMS: Team[] = [
  // UEFA
  { id: 'ger', name: 'Germany', flag: '🇩🇪', confederation: 'UEFA', group: 'A' },
  { id: 'esp', name: 'Spain', flag: '🇪🇸', confederation: 'UEFA', group: 'B' },
  { id: 'fra', name: 'France', flag: '🇫🇷', confederation: 'UEFA', group: 'C' },
  { id: 'eng', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA', group: 'D' },
  { id: 'por', name: 'Portugal', flag: '🇵🇹', confederation: 'UEFA', group: 'E' },
  { id: 'ned', name: 'Netherlands', flag: '🇳🇱', confederation: 'UEFA', group: 'F' },
  { id: 'bel', name: 'Belgium', flag: '🇧🇪', confederation: 'UEFA', group: 'G' },
  { id: 'cro', name: 'Croatia', flag: '🇭🇷', confederation: 'UEFA', group: 'H' },
  { id: 'aut', name: 'Austria', flag: '🇦🇹', confederation: 'UEFA', group: 'A' },
  { id: 'sui', name: 'Switzerland', flag: '🇨🇭', confederation: 'UEFA', group: 'B' },
  { id: 'den', name: 'Denmark', flag: '🇩🇰', confederation: 'UEFA', group: 'C' },
  { id: 'sco', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA', group: 'D' },
  { id: 'srb', name: 'Serbia', flag: '🇷🇸', confederation: 'UEFA', group: 'E' },
  { id: 'pol', name: 'Poland', flag: '🇵🇱', confederation: 'UEFA', group: 'F' },
  { id: 'tur', name: 'Türkiye', flag: '🇹🇷', confederation: 'UEFA', group: 'G' },
  { id: 'ukr', name: 'Ukraine', flag: '🇺🇦', confederation: 'UEFA', group: 'H' },

  // CONMEBOL
  { id: 'arg', name: 'Argentina', flag: '🇦🇷', confederation: 'CONMEBOL', group: 'A' },
  { id: 'bra', name: 'Brazil', flag: '🇧🇷', confederation: 'CONMEBOL', group: 'B' },
  { id: 'uru', name: 'Uruguay', flag: '🇺🇾', confederation: 'CONMEBOL', group: 'C' },
  { id: 'col', name: 'Colombia', flag: '🇨🇴', confederation: 'CONMEBOL', group: 'D' },
  { id: 'ecu', name: 'Ecuador', flag: '🇪🇨', confederation: 'CONMEBOL', group: 'E' },
  { id: 'par', name: 'Paraguay', flag: '🇵🇾', confederation: 'CONMEBOL', group: 'F' },
  { id: 'ven', name: 'Venezuela', flag: '🇻🇪', confederation: 'CONMEBOL', group: 'G' },
  { id: 'chl', name: 'Chile', flag: '🇨🇱', confederation: 'CONMEBOL', group: 'H' },

  // CONCACAF
  { id: 'usa', name: 'USA', flag: '🇺🇸', confederation: 'CONCACAF', group: 'A' },
  { id: 'mex', name: 'Mexico', flag: '🇲🇽', confederation: 'CONCACAF', group: 'B' },
  { id: 'can', name: 'Canada', flag: '🇨🇦', confederation: 'CONCACAF', group: 'C' },
  { id: 'pan', name: 'Panama', flag: '🇵🇦', confederation: 'CONCACAF', group: 'D' },
  { id: 'cos', name: 'Costa Rica', flag: '🇨🇷', confederation: 'CONCACAF', group: 'E' },
  { id: 'jam', name: 'Jamaica', flag: '🇯🇲', confederation: 'CONCACAF', group: 'F' },

  // CAF
  { id: 'mor', name: 'Morocco', flag: '🇲🇦', confederation: 'CAF', group: 'G' },
  { id: 'sen', name: 'Senegal', flag: '🇸🇳', confederation: 'CAF', group: 'H' },
  { id: 'nig', name: 'Nigeria', flag: '🇳🇬', confederation: 'CAF', group: 'A' },
  { id: 'egy', name: 'Egypt', flag: '🇪🇬', confederation: 'CAF', group: 'B' },
  { id: 'cmr', name: 'Cameroon', flag: '🇨🇲', confederation: 'CAF', group: 'C' },
  { id: 'gha', name: 'Ghana', flag: '🇬🇭', confederation: 'CAF', group: 'D' },
  { id: 'drc', name: 'DR Congo', flag: '🇨🇩', confederation: 'CAF', group: 'E' },
  { id: 'tun', name: 'Tunisia', flag: '🇹🇳', confederation: 'CAF', group: 'F' },

  // AFC
  { id: 'jpn', name: 'Japan', flag: '🇯🇵', confederation: 'AFC', group: 'G' },
  { id: 'kor', name: 'South Korea', flag: '🇰🇷', confederation: 'AFC', group: 'H' },
  { id: 'aus', name: 'Australia', flag: '🇦🇺', confederation: 'AFC', group: 'A' },
  { id: 'irn', name: 'Iran', flag: '🇮🇷', confederation: 'AFC', group: 'B' },
  { id: 'ksa', name: 'Saudi Arabia', flag: '🇸🇦', confederation: 'AFC', group: 'C' },
  { id: 'irq', name: 'Iraq', flag: '🇮🇶', confederation: 'AFC', group: 'D' },
  { id: 'uzb', name: 'Uzbekistan', flag: '🇺🇿', confederation: 'AFC', group: 'E' },
  { id: 'jor', name: 'Jordan', flag: '🇯🇴', confederation: 'AFC', group: 'F' },

  // OFC
  { id: 'nzl', name: 'New Zealand', flag: '🇳🇿', confederation: 'OFC', group: 'G' },
];
