export function apiDomain() {
  if (process.env["NODE_ENV"] === "production") {
    return ("https://book.notes.club")
  } else if (process.env["NODE_ENV"] === "development") {
    return ("http://wikir-api.hec.ngrok.io")
  }
}
