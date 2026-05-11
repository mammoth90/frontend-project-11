import { proxy } from 'valtio/vanilla'

const state = {
  ui: 'ru',
  form: {
      validation:{
        status: null,
        message: ''
      },  
      process: {
       status: null,
        value: ''
      },
    },
  feedsLink: [],
  feeds: [],
  items: [],
  activeFeed:''
}

export default proxy(state)
