export const normalizeData = (items, type) => {
  if (!items || !Array.isArray(items)) return [];
  return items.map(item => ({
    name: item.fileName || item.FileName || "Unknown",
    size: item.fileSize || item.FileSize || "N/A",
    url: item.fileLink || item.FileLink || "#",
    expire: item.fileExpire || item.FileExpire,
    type: type
  }));
};

export const extractProductId = (input) => {
  if (!input) return "";
  const trimmed = input.trim();

  try {
    const urlMatch = trimmed.match(/apps\.microsoft\.com\/(?:.*\/)?(?:detail|productId)\/([A-Z0-9]+)/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1].toUpperCase();
    }

    if (trimmed.includes('http')) {
      const url = new URL(trimmed);
      const pathSegments = url.pathname.split('/');
      for (const segment of pathSegments) {
        if (/^[A-Z0-9]{12,}$/i.test(segment)) {
          return segment.toUpperCase();
        }
      }
    }
  } catch (e) { }

  if (/^[A-Z0-9]{12,}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  return trimmed;
};
