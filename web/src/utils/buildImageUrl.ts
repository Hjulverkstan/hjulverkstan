export const buildImageUrl = (fileName?: string | null): string | undefined => {
  if (!fileName) return undefined;

  const urlBase = import.meta.env.VITE_IMAGES_SLUG;
  return `${urlBase}/${fileName}`;
};
