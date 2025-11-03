import { useQuery } from '@tanstack/react-query';

import { StandardError } from '../../api';
import * as api from './api';
import { Story } from './types';
import { GetStoriesParams, GetStoryParams } from './api';

//

export const useStoriesQ = ({ lang }: GetStoriesParams) =>
  useQuery<Story[], StandardError>(api.createGetStories({ lang }));

export const useStoryQ = ({ id, lang }: GetStoryParams) =>
  useQuery<Story, StandardError>({
    ...api.createGetStory({ id, lang }),
    enabled: !!id,
  });
