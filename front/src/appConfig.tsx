export function apiDomain() {
  if (process.env["NODE_ENV"] === "production") {
    return ("https://api.treeconf.com")
  } else if (process.env["NODE_ENV"] === "development") {
    return ("http://localhost:3000")
  }
}
