import humps from 'humps';

export function capitalize(str: string): string {
  return (str.charAt(0).toUpperCase() + str.slice(1))
}

export function humanize(str: string): string {
  return (capitalize(humps.decamelize(str, { separator: " " })))
}
