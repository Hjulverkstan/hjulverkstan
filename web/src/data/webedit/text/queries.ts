import { useQuery } from '@tanstack/react-query';

import { StandardError } from '../../api';
import * as api from './api';
import { GetTextParams, GetTextsParams } from './api';
import { Text } from './types';

//

export const useTextsQ = ({ locale }: GetTextsParams) =>
  useQuery<Text[], StandardError>(api.createGetTexts({ locale }));

export const useTextQ = ({ id, locale }: GetTextParams) =>
  useQuery<Text, StandardError>({
    ...api.createGetText({ id, locale }),
    enabled: !!id,
  });
