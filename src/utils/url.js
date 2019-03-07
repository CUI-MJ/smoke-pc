function query() {
  let searchArray = document.location.search.slice(1).split('&')
  let query = {}
  searchArray.forEach((item) => {
    let temp = item.split('=')
    query[temp[0]] = temp[1]
  })
  return query
}
export default {
  query: query
}