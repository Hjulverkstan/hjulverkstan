import { renderHook } from '@testing-library/react';
import {
  useDeleteAndSetVehicleImage,
  useDeleteImageM,
  useUploadAndSetVehicleImage,
  useUploadImageM,
} from './mutations';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as reactQuery from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as imageApi from './api';
import * as vehicleApi from '@data/vehicle/api';
import { invalidateQueries } from '@data/queries';

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useMutation: vi
      .fn()
      .mockReturnValue({ mutate: vi.fn(), mutateAsync: vi.fn() }),
  };
});

vi.mock('./api', () => ({
  createUploadImage: vi.fn(),
  createDeleteImage: vi.fn(),
}));

vi.mock('@data/image/api', () => ({
  createUploadImage: vi.fn(),
  createDeleteImage: vi.fn(),
}));

vi.mock('@data/vehicle/api', () => ({
  createEditVehicle: vi.fn(),
  createGetVehicles: vi.fn(() => ({ queryKey: ['/vehicle'] })),
}));

vi.mock('@data/queries', () => ({
  invalidateQueries: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('image mutations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (imageApi.createUploadImage as any).mockReturnValue({
      mutationFn: vi.fn(),
    });
    (imageApi.createDeleteImage as any).mockReturnValue({
      mutationFn: vi.fn(),
    });
  });

  it('useUploadImageM should call useMutation with the upload api factory', () => {
    renderHook(() => useUploadImageM(), { wrapper });
    expect(reactQuery.useMutation).toHaveBeenCalled();
    expect(imageApi.createUploadImage).toHaveBeenCalled();
  });

  it('useDeleteImageM should call useMutation with the delete api factory', () => {
    renderHook(() => useDeleteImageM(), { wrapper });
    expect(reactQuery.useMutation).toHaveBeenCalled();
    expect(imageApi.createDeleteImage).toHaveBeenCalled();
  });

  describe('useDeleteAndSetVehicleImage', () => {
    it('should skip delete and call editVehicle when imageURL is absent', async () => {
      const mockDeleteFn = vi.fn();
      const mockEditFn = vi.fn().mockResolvedValue({ id: '1' });
      (imageApi.createDeleteImage as any).mockReturnValue({
        mutationFn: mockDeleteFn,
      });
      (vehicleApi.createEditVehicle as any).mockReturnValue({
        mutationFn: mockEditFn,
      });

      renderHook(() => useDeleteAndSetVehicleImage(), { wrapper });
      const { mutationFn } = (reactQuery.useMutation as any).mock.calls.at(
        -1,
      )[0];

      await mutationFn({ id: '1', vehicleType: 'BIKE' } as any);

      expect(mockDeleteFn).not.toHaveBeenCalled();
      expect(mockEditFn).toHaveBeenCalledWith({ id: '1', vehicleType: 'BIKE' });
    });

    it('should call delete then editVehicle (without imageURL) when imageURL is present', async () => {
      const mockDeleteFn = vi.fn().mockResolvedValue('ok');
      const mockEditFn = vi.fn().mockResolvedValue({ id: '1' });
      (imageApi.createDeleteImage as any).mockReturnValue({
        mutationFn: mockDeleteFn,
      });
      (vehicleApi.createEditVehicle as any).mockReturnValue({
        mutationFn: mockEditFn,
      });

      renderHook(() => useDeleteAndSetVehicleImage(), { wrapper });
      const { mutationFn } = (reactQuery.useMutation as any).mock.calls.at(
        -1,
      )[0];

      await mutationFn({
        id: '1',
        imageURL: 'https://cdn.example.com/img.jpg',
        vehicleType: 'BIKE',
      } as any);

      expect(mockDeleteFn).toHaveBeenCalledWith({
        imageURL: 'https://cdn.example.com/img.jpg',
      });
      expect(mockEditFn).toHaveBeenCalledWith({ id: '1', vehicleType: 'BIKE' });
    });

    it('should invalidate vehicle list on success', () => {
      (imageApi.createDeleteImage as any).mockReturnValue({
        mutationFn: vi.fn(),
      });
      (vehicleApi.createEditVehicle as any).mockReturnValue({
        mutationFn: vi.fn(),
      });

      renderHook(() => useDeleteAndSetVehicleImage(), { wrapper });
      const { onSuccess } = (reactQuery.useMutation as any).mock.calls.at(
        -1,
      )[0];
      onSuccess?.();

      expect(invalidateQueries).toHaveBeenCalledWith([['/vehicle']]);
    });
  });

  describe('useUploadAndSetVehicleImage', () => {
    it('should upload the file and then edit vehicle with the new imageURL', async () => {
      const newImageURL = 'https://cdn.example.com/new.jpg';
      const mockUploadFn = vi.fn().mockResolvedValue(newImageURL);
      const mockEditFn = vi.fn().mockResolvedValue({ id: '1' });
      (imageApi.createUploadImage as any).mockReturnValue({
        mutationFn: mockUploadFn,
      });
      (vehicleApi.createEditVehicle as any).mockReturnValue({
        mutationFn: mockEditFn,
      });

      renderHook(() => useUploadAndSetVehicleImage(), { wrapper });
      const { mutationFn } = (reactQuery.useMutation as any).mock.calls.at(
        -1,
      )[0];

      const file = new File([''], 'new.jpg');
      const vehicle = { id: '1', vehicleType: 'BIKE' } as any;
      await mutationFn({ file, vehicle });

      expect(mockUploadFn).toHaveBeenCalledWith({ file });
      expect(mockEditFn).toHaveBeenCalledWith({
        id: '1',
        vehicleType: 'BIKE',
        imageURL: newImageURL,
      });
    });

    it('should invalidate vehicle list on success', () => {
      (imageApi.createUploadImage as any).mockReturnValue({
        mutationFn: vi.fn(),
      });
      (vehicleApi.createEditVehicle as any).mockReturnValue({
        mutationFn: vi.fn(),
      });

      renderHook(() => useUploadAndSetVehicleImage(), { wrapper });
      const { onSuccess } = (reactQuery.useMutation as any).mock.calls.at(
        -1,
      )[0];
      onSuccess?.();

      expect(invalidateQueries).toHaveBeenCalledWith([['/vehicle']]);
    });
  });
});
