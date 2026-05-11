import axios from 'axios'
import parseRss from './parseRss'
import state from './state'

const allOrigin = 'https://allorigins.hexlet.app/get?url='
export default function feedRequest (i18n, link) {

  axios.get(allOrigin + encodeURIComponent(link)).then(({data}) => {
  const response = parseRss(data)  
  state.feeds.push(response.feeds)
  state.items.push(response.items)
  state.activeFeed = response.feeds.id
    }).catch(() => {
    state.form.validation.status = 'feeds_error' 
    state.form.validation.message = i18n.t('messages.feeds_error') 
    })
}
