import { useQuery } from '@tanstack/react-query';

import { StandardError } from '../../api';
import * as api from './api';
import { Story } from './types';
import { GetStoriesParams, GetStoryParams } from './api';

//

export const useStoriesQ = ({ locale }: GetStoriesParams) =>
  useQuery<Story[], StandardError>(api.createGetStories({ locale }));

export const useStoryQ = ({ id, locale }: GetStoryParams) =>
  useQuery<Story, StandardError>({
    ...api.createGetStory({ id, locale }),
    enabled: !!id,
  });
