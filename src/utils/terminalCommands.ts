export interface TerminalCommand {
  name: string;
  description: string;
  usage: string;
  handler: (args: string[]) => Promise<string> | string;
}

export const createCommandHandler = (
  onStatsMonth: (month: number) => void,
  onStatsYear: () => void,
  onClear: () => void
): Record<string, TerminalCommand> => {
  return {
    help: {
      name: 'help',
      description: 'Affiche la liste des commandes disponibles',
      usage: 'help',
      handler: () => {
        return `Commandes disponibles:
  stats --month <mois>  Affiche les statistiques du mois (1-12)
  stats --year          Affiche les statistiques de l'année
  clear                 Nettoie le terminal
  help                  Affiche cette aide

Exemples:
  stats --month 3      Statistiques de mars
  stats --year          Statistiques annuelles`;
      },
    },
    stats: {
      name: 'stats',
      description: 'Affiche les statistiques GitHub',
      usage: 'stats --month <mois> | stats --year',
      handler: (args: string[]) => {
        if (args.includes('--year')) {
          onStatsYear();
          return 'Chargement des statistiques annuelles...';
        }
        if (args.includes('--month')) {
          const monthIndex = args.indexOf('--month');
          const month = parseInt(args[monthIndex + 1]);
          if (isNaN(month) || month < 1 || month > 12) {
            return 'Erreur: Le mois doit être un nombre entre 1 et 12.\nUsage: stats --month <mois>';
          }
          onStatsMonth(month - 1); // Convertir en index 0-based
          return `Chargement des statistiques de ${getMonthName(month)}...`;
        }
        return 'Usage: stats --month <mois> | stats --year';
      },
    },
    clear: {
      name: 'clear',
      description: 'Nettoie le terminal',
      usage: 'clear',
      handler: () => {
        onClear();
        return '';
      },
    },
  };
};

const getMonthName = (month: number): string => {
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  return months[month - 1] || 'mois inconnu';
};

export const executeCommand = (
  input: string,
  commands: Record<string, TerminalCommand>
): Promise<string> | string => {
  const trimmed = input.trim();
  if (!trimmed) return '';

  const parts = trimmed.split(/\s+/);
  const commandName = parts[0];
  const args = parts.slice(1);

  const command = commands[commandName];
  if (!command) {
    return `Commande inconnue: ${commandName}\nTapez 'help' pour voir les commandes disponibles.`;
  }

  return command.handler(args);
};

