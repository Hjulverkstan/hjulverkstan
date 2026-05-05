import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDeleteImage, createUploadImage } from './api';
import { endpoints, instance } from '../api';

vi.mock('../api', () => ({
  instance: {
    post: vi.fn(),
    delete: vi.fn(),
  },
  endpoints: {
    image: '/image',
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('image api factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUploadImage', () => {
    it('should post to /image/upload with FormData and return imageURL', async () => {
      const imageURL = 'https://cdn.example.com/img.jpg';
      (instance.post as any).mockResolvedValue({ data: { imageURL } });

      const config = createUploadImage();
      const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });
      const result = await config.mutationFn({ file });

      expect(instance.post).toHaveBeenCalledWith(
        `${endpoints.image}/upload`,
        expect.any(FormData),
      );
      expect(result).toBe(imageURL);
    });

    it('should append the file to FormData under the key "file"', async () => {
      (instance.post as any).mockResolvedValue({ data: { imageURL: 'url' } });

      const config = createUploadImage();
      const file = new File([''], 'test.jpg');
      await config.mutationFn({ file });

      const formData: FormData = (instance.post as any).mock.calls[0][1];
      expect(formData.get('file')).toBe(file);
    });
  });

  describe('createDeleteImage', () => {
    it('should delete to /image/delete with URL-encoded imageURL query param', async () => {
      (instance.delete as any).mockResolvedValue({ data: 'deleted' });

      const imageURL = 'https://cdn.example.com/my image.jpg';
      const config = createDeleteImage();
      const result = await config.mutationFn({ imageURL });

      expect(instance.delete).toHaveBeenCalledWith(
        `/image/delete?imageURL=${encodeURIComponent(imageURL)}`,
      );
      expect(result).toBe('deleted');
    });
  });
});
