import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from '../api';

import { Vehicle } from '../vehicle/types';

export interface GetImageURL {
  image: Vehicle['imageURL'];
}

export interface GetImage {
  imageURL: string;
}

export const createGetImage = (imageURL: string) => {
  if (!imageURL) {
    throw new Error('imageURL is required');
  }

  return {
    queryKey: ['image', imageURL],
    queryFn: () =>
      instance
        .get<GetImageURL>(`${endpoints.image}/${imageURL}`)
        .then((res) => parseResponseData(res.data) as GetImage)
        .catch(createErrorHandler(endpoints.image)),
  };
};

export type CreateImageParams = {
  file: File;
};

export const createCreateImage = () => ({
  mutationFn: (image: CreateImageParams) =>
    instance
      .post(`${endpoints.image}/upload`, image.file, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data.imageURL)
      .catch(createErrorHandler(endpoints.image)),
});

export type DeleteImageParams = {
  imageURL: string;
};

export const createDeleteImage = () => ({
  mutationFn: ({ imageURL }: DeleteImageParams) =>
    instance
      .delete(`${endpoints.image}/delete/${encodeURIComponent(imageURL)}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.image)),
});
