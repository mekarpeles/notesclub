export function apiDomain() {
  if (process.env["NODE_ENV"] === "production") {
    return ("https://api.notes.club")
  } else if (process.env["NODE_ENV"] === "development") {
    return ("http://notesclub-api.hec.ngrok.io")
  }
}
