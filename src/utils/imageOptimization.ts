/**
 * Image Optimization Utilities
 * Helper functions for lazy loading and optimizing images
 */

/**
 * Create an intersection observer for lazy loading images
 */
export const createImageObserver = () => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;

          if (src) {
            img.src = src;
            img.removeAttribute("data-src");
          }

          img.classList.remove("lazy");
          img.classList.add("loaded");
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.01,
    }
  );
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Generate srcset for responsive images
 */
export const generateSrcSet = (baseUrl: string, sizes: number[]): string => {
  return sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(", ");
};

/**
 * Optimize background image loading
 */
export const loadBackgroundImage = (element: HTMLElement, imageUrl: string) => {
  const img = new Image();
  img.onload = () => {
    element.style.backgroundImage = `url(${imageUrl})`;
    element.classList.add("bg-loaded");
  };
  img.src = imageUrl;
};
