export default function useBasePath() {
  const addBasePath = (imagePath: string): string => {
    if (
      !imagePath ||
      imagePath.startsWith("http") ||
      imagePath.startsWith("//")
    ) {
      return imagePath;
    }

    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;

    return `/${cleanPath}`;
  };

  return { addBasePath };
}
