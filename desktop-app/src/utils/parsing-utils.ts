import logger from '../logger';

const parseGitHubUrl = (url: string) => {
  logger.info('Parsing GitHub URL ' + url, {});
  // given an arbitrary github url, parse it to get the owner and repository name
  const urlParts = url.split('/');
  const owner = urlParts[urlParts.length - 2];
  const repo = urlParts[urlParts.length - 1];
  logger.info(`Owner: ${owner}, Repo: ${repo}`);
  return { owner, repo };
};

const parsingUtils = {
  parseGitHubUrl,
};

export default parsingUtils;
