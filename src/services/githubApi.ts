import { GitHubUser, Repository, Commit, PullRequest, Issue } from '../types/github';
import { getAccessToken } from './authService';
import { RateLimitError, parseRateLimitHeaders, getRateLimitMessage } from '../utils/rateLimitHandler';

const GITHUB_API_BASE = 'https://api.github.com';

const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (includeAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
  }

  return headers;
};

const fetchWithErrorHandling = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Non autorisé. Veuillez vous reconnecter.');
    }
    if (response.status === 403) {
      // Vérifier si c'est un rate limit
      const rateLimitInfo = parseRateLimitHeaders(response.headers);
      const resetTime = rateLimitInfo?.reset;
      const limit = rateLimitInfo?.limit;
      const remaining = rateLimitInfo?.remaining;

      // Si remaining est 0, c'est un rate limit
      if (remaining === 0 || response.headers.get('X-RateLimit-Remaining') === '0') {
        throw new RateLimitError(
          getRateLimitMessage(new RateLimitError('', resetTime, limit, remaining)),
          resetTime,
          limit,
          remaining
        );
      }

      // Sinon, c'est une autre erreur 403
      throw new Error('Accès refusé. Vérifiez vos permissions.');
    }
    
    // Gérer les erreurs de rate limit dans le body de la réponse
    try {
      const errorData = await response.json();
      if (errorData.message && errorData.message.includes('rate limit')) {
        const rateLimitInfo = parseRateLimitHeaders(response.headers);
        const resetTime = rateLimitInfo?.reset;
        throw new RateLimitError(
          getRateLimitMessage(new RateLimitError('', resetTime, rateLimitInfo?.limit, rateLimitInfo?.remaining)),
          resetTime,
          rateLimitInfo?.limit,
          rateLimitInfo?.remaining
        );
      }
      throw new Error(errorData.message || `Erreur API: ${response.status} ${response.statusText}`);
    } catch (jsonError) {
      if (jsonError instanceof RateLimitError) {
        throw jsonError;
      }
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }
  }

  return response.json();
};

export const getUser = async (username?: string): Promise<GitHubUser> => {
  const endpoint = username 
    ? `${GITHUB_API_BASE}/users/${username}`
    : `${GITHUB_API_BASE}/user`;
  
  return fetchWithErrorHandling<GitHubUser>(endpoint, {
    headers: getHeaders(!!username || getAccessToken() !== null),
  });
};

export const getUserRepositories = async (
  username?: string,
  page: number = 1,
  perPage: number = 100
): Promise<Repository[]> => {
  const endpoint = username
    ? `${GITHUB_API_BASE}/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`
    : `${GITHUB_API_BASE}/user/repos?page=${page}&per_page=${perPage}&sort=updated&affiliation=owner,collaborator`;
  
  return fetchWithErrorHandling<Repository[]>(endpoint, {
    headers: getHeaders(!!username || getAccessToken() !== null),
  });
};

export const getAllUserRepositories = async (
  username?: string,
  onProgress?: (current: number, total: number | null, message: string) => void
): Promise<Repository[]> => {
  const allRepos: Repository[] = [];
  let page = 1;
  let hasMore = true;

  onProgress?.(0, null, 'Début de la récupération des repositories...');

  while (hasMore) {
    onProgress?.(page, null, `Récupération des repositories (page ${page})...`);
    const repos = await getUserRepositories(username, page);
    allRepos.push(...repos);
    hasMore = repos.length === 100;
    onProgress?.(allRepos.length, hasMore ? null : allRepos.length, `Repositories récupérés: ${allRepos.length}${hasMore ? '...' : ''}`);
    page++;
  }

  return allRepos;
};

export const getRepositoryCommits = async (
  owner: string,
  repo: string,
  since?: string,
  until?: string,
  page: number = 1,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<Commit[]> => {
  let url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?page=${page}&per_page=100`;
  
  if (since) {
    url += `&since=${since}`;
  }
  if (until) {
    url += `&until=${until}`;
  }

  onProgress?.(0, 0, `Récupération des commits de ${owner}/${repo}...`);
  const commits = await fetchWithErrorHandling<Commit[]>(url, {
    headers: getHeaders(),
  });

  onProgress?.(0, commits.length, `Récupération des stats pour ${commits.length} commits...`);

  // Récupérer les stats pour chaque commit
  const commitsWithStats = await Promise.all(
    commits.map(async (commit, index) => {
      try {
        const commitDetail = await fetchWithErrorHandling<Commit>(
          `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits/${commit.sha}`,
          { headers: getHeaders() }
        );
        onProgress?.(index + 1, commits.length, `Stats récupérées: ${index + 1}/${commits.length}`);
        return commitDetail;
      } catch (error) {
        console.warn(`Impossible de récupérer les stats pour le commit ${commit.sha}:`, error);
        onProgress?.(index + 1, commits.length, `Erreur pour commit ${commit.sha.substring(0, 7)}`);
        return commit;
      }
    })
  );

  return commitsWithStats;
};

export const getUserPullRequests = async (
  username: string,
  state: 'open' | 'closed' | 'all' = 'all',
  page: number = 1,
  onProgress?: (current: number, total: number | null, message: string) => void
): Promise<PullRequest[]> => {
  onProgress?.(page, null, `Récupération des Pull Requests (page ${page})...`);
  const url = `${GITHUB_API_BASE}/search/issues?q=author:${username}+type:pr+state:${state}&page=${page}&per_page=100`;
  const response = await fetchWithErrorHandling<{ items: PullRequest[] }>(url, {
    headers: getHeaders(),
  });
  onProgress?.(response.items.length, response.items.length, `Pull Requests récupérées: ${response.items.length}`);
  return response.items;
};

export const getUserIssues = async (
  username: string,
  state: 'open' | 'closed' | 'all' = 'all',
  page: number = 1,
  onProgress?: (current: number, total: number | null, message: string) => void
): Promise<Issue[]> => {
  onProgress?.(page, null, `Récupération des Issues (page ${page})...`);
  const url = `${GITHUB_API_BASE}/search/issues?q=author:${username}+type:issue+state:${state}&page=${page}&per_page=100`;
  const response = await fetchWithErrorHandling<{ items: Issue[] }>(url, {
    headers: getHeaders(),
  });
  onProgress?.(response.items.length, response.items.length, `Issues récupérées: ${response.items.length}`);
  return response.items;
};

export const getAllUserCommits = async (
  _username: string,
  repos: Repository[],
  since?: string,
  until?: string,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<Commit[]> => {
  const allCommits: Commit[] = [];

  // Limiter le nombre de repos pour éviter les limites API
  const reposToProcess = repos.slice(0, 50);

  onProgress?.(0, reposToProcess.length, `Début de la récupération des commits (${reposToProcess.length} repos)...`);

  for (let i = 0; i < reposToProcess.length; i++) {
    const repo = reposToProcess[i];
    try {
      const [owner, repoName] = repo.full_name.split('/');
      onProgress?.(i + 1, reposToProcess.length, `Traitement de ${owner}/${repoName} (${i + 1}/${reposToProcess.length})...`);
      const commits = await getRepositoryCommits(owner, repoName, since, until, 1, (_commitCurrent, commitTotal, commitMsg) => {
        if (commitTotal > 0) {
          onProgress?.(i + 1, reposToProcess.length, `${owner}/${repoName}: ${commitMsg}`);
        }
      });
      // Ajouter l'info du repo à chaque commit pour faciliter le mapping
      const commitsWithRepo = commits.map(commit => ({
        ...commit,
        repository: repo.full_name,
      }));
      allCommits.push(...commitsWithRepo);
      onProgress?.(i + 1, reposToProcess.length, `${owner}/${repoName}: ${commits.length} commits récupérés`);
    } catch (error) {
      console.warn(`Erreur lors de la récupération des commits pour ${repo.full_name}:`, error);
      onProgress?.(i + 1, reposToProcess.length, `Erreur pour ${repo.full_name}`);
    }
  }

  return allCommits;
};

