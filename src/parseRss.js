import { uniqueId } from "lodash"

export default (data) => {
      const { contents } = data
      const parser = new DOMParser()
      const xml = parser.parseFromString(contents, 'text/xml')
      const channel = xml.querySelector('channel')
      const title = channel.querySelector('title')
      const description = channel.querySelector('description')
      const itemsEl = xml.querySelectorAll('item')
      const items = Array.from(itemsEl).map(el => {
        const title = el.querySelector('title')
        const link = el.querySelector('link')
        const description = el.querySelector('description')
          return ({
            title: title.textContent,
            link: link.textContent,
            description: description.textContent,
          })
        })
  const id = uniqueId()
      const result = {
        feeds: {
          id,
          title: title.textContent,
          description: description.textContent,
        },
        items: {
          feedId: id,
          posts: items,
        }
      }
  return result
}
