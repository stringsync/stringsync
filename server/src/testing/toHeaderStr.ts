type Headers = {
  [key: string]: string;
};

export const toHeaderStr = (headers: Headers): string => {
  const parts = new Array<string>();
  for (const [key, value] of Object.entries(headers)) {
    parts.push(`${key}=${value}`);
  }
  return parts.join(' ');
};
