export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

export const sanitizeText = (str: string) => {
  return str.replace(/(\r\n|\n|\r)/gm, '').trim();
};
