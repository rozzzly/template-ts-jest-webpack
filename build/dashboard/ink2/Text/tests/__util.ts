const csiRegex = /\u001b/ug;
export const escapeCSI = (str: string): string => str.replace(csiRegex, '\\u001b');
