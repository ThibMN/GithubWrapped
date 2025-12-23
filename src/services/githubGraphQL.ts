import { ContributionWeek } from '../types/github';
import { getAccessToken } from './authService';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

const getHeaders = (): HeadersInit => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Token d\'accès requis pour les requêtes GraphQL');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

const fetchGraphQL = async <T>(query: string, variables?: Record<string, unknown>): Promise<T> => {
  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ query, variables }),
  });

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    throw new Error(`Erreur GraphQL: ${result.errors.map(e => e.message).join(', ')}`);
  }

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
  }

  return result.data;
};

export const getUserContributions = async (
  username: string,
  year: number
): Promise<ContributionWeek[]> => {
  const startDate = `${year}-01-01T00:00:00Z`;
  const endDate = `${year}-12-31T23:59:59Z`;

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    username,
    from: startDate,
    to: endDate,
  };

  interface ContributionsData {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: ContributionWeek[];
        };
      };
    };
  }

  const data = await fetchGraphQL<ContributionsData>(query, variables);
  return data.user.contributionsCollection.contributionCalendar.weeks;
};

export const getUserRepositoryStats = async (username: string): Promise<{
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
}> => {
  const query = `
    query($username: String!) {
      user(login: $username) {
        repositories {
          totalCount
        }
        repositoriesContributedTo {
          totalCount
        }
        starredRepositories {
          totalCount
        }
      }
    }
  `;

  const variables = { username };

  interface UserStatsData {
    user: {
      repositories: { totalCount: number };
      repositoriesContributedTo: { totalCount: number };
      starredRepositories: { totalCount: number };
    };
  }

  const data = await fetchGraphQL<UserStatsData>(query, variables);
  
  return {
    totalRepositories: data.user.repositories.totalCount,
    totalStars: data.user.starredRepositories.totalCount,
    totalForks: 0, // Nécessite une requête supplémentaire
  };
};

