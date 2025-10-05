import { instance, endpoints, createErrorHandler } from '../api';

// CREATE

export type CreateImageParams = {
  file: File;
};

export const createUploadImage = () => ({
  mutationFn: (image: CreateImageParams) => {
    const formData = new FormData();
    formData.append('file', image.file);
    return instance
      .post(`${endpoints.image}/upload`, formData)
      .then((res) => res.data.imageURL)
      .catch(createErrorHandler(endpoints.image));
  },
});

// DELETE

export type DeleteImageParams = {
  imageURL: string;
};

export const createDeleteImage = () => ({
  mutationFn: ({ imageURL }: DeleteImageParams) =>
    instance
      .delete(
        `${endpoints.image}/delete?imageURL=${encodeURIComponent(imageURL)}`,
      )
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.image)),
});
