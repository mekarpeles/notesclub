export function apiDomain() {
  if (process.env["NODE_ENV"] === "production") {
    return ("https://api.wikir.org")
  } else if (process.env["NODE_ENV"] === "development") {
    return ("http://localhost:3000")
  }
}
