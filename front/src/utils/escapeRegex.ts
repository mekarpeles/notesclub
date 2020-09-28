export const escapeRegExp = (content: string) => {
  return content.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
