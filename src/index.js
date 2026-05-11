import * as yup from 'yup'
import { subscribe, snapshot } from 'valtio/vanilla'
import  state from './state.js'
import i18next from 'i18next'
import { resources } from './resources.js'
import classNames from 'classnames'
import getFeeds from './feeds.js'


  const validation =  (value, i18n) => {
    console.log('CURRENT VALUE', value)
    console.log('SATE before validation:',snapshot(state))
      const { link } = value
    validationSchema.validate(value).then(() => {
      if(!hasFeed(link)){
        console.log("HERE!")
      state.feedsLink.push(link)
      state.form.validation.status = 'passed'
      state.form.validation.message = i18n.t('messages.added')
      state.form.process.value = ''
      getFeeds(i18n, link)
      }
      else {
        console.log('HERE! NOT PASEED')
      state.form.validation.status = 'notPassed'
      state.form.validation.message = i18n.t('messages.exist')
      state.form.process.value = link
            }
    }).catch((e) => {
      state.form.validation.status = 'notPassed'
      state.form.validation.message = e.message
      state.form.process.value = link
    })
    console.log('STATE after:', snapshot(state))
  }

  const hasFeed = (feed) => {
  const result = state.feedsLink.filter(el => el === feed)
    if (result.length > 0) {
      return true
    }
    else {
      return false
    }
  
}

const validationState = (el) => {
  const  stat = state.form.validation.status
  switch(stat) {
    case 'passed':
      el.className = 'green'
      el.textContent = state.form.validation.message
      break
    case 'notPassed':
      el.className = 'red'
      el.textContent = state.form.validation.message
      break
    case 'feeds_error':
      el.className = 'red'
      el.textContent = state.form.validation.message
      break
    default:
      el.textContent = ''
  }
 }

 const renderHead = (root, state, i18n) => {
   root.innerHTML = ''
  const currentState = snapshot(state)
  const h1El = document.createElement('h1')
  h1El.textContent = i18n.t('page.title')

  const pEl = document.createElement('p')
  pEl.textContent = i18n.t('page.subTitle')

  const h6El = document.createElement('h6')
  h6El.classList.add('comment')
  h6El.textContent = i18n.t('page.example')

  const commentEl = document.createElement('h6')
  validationState(commentEl) 

  const formEl = document.createElement('form')
  formEl.id = 'form'
  formEl.action = ''
  formEl.className = 'form-floating'
  

  const inputText = document.createElement('input')
  inputText.type = 'text'
  const cn = classNames('input', 'form-control', {
    'is-valid': currentState.form.validation.status === 'passed',
    'is-invalid': currentState.form.validation.status === 'notPassed',
  })
  inputText.id = 'floatingInput'
  inputText.className = cn
  inputText.name = 'link'
  inputText.value = currentState.form.process.value

  const labelEl = document.createElement('label')
  labelEl.setAttribute('for', 'floatingInput')  
  labelEl.textContent = i18n.t('page.label')

  const inputBtn = document.createElement('input')
  inputBtn.type = 'submit'
  inputBtn.classList.add('btn', 'btn-primary', 'button-cs')
  inputBtn.value = i18n.t('page.button')

  root.innerHTML = ''
  root.appendChild(h1El)
  root.appendChild(pEl)
  formEl.appendChild(inputText)
  formEl.appendChild(labelEl)
  formEl.appendChild(inputBtn)
  root.appendChild(formEl)
  root.appendChild(h6El)
  if (commentEl.textContent !== ''){
    root.appendChild(commentEl)
  }

  formEl.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(formEl)
    const link = data.get('link').trim()
    validation({ link }, i18n)
  })
}

const renderFeeds = (root, state, i18n) => {
    root.innerHTML = ''
    const currentState = snapshot(state)
    const h5El = document.createElement('h5')
    h5El.textContent = i18n.t('page.feedsTitle')
    const ulEl = document.createElement('ul')
    ulEl.className = classNames('feeds-list')
    currentState.feeds.forEach(feed => {
      const title = document.createElement('p')
      title.className = classNames('feed-title')
      title.textContent = feed.title
      const desc = document.createElement('p')
      desc.className = classNames('feed-desc')
      desc.textContent = feed.description
      const liEl = document.createElement('li')
      liEl.append(title, desc)
      ulEl.appendChild(liEl)
    })
    root.append(h5El, ulEl)
}

const renderItems =  (root, state, i18n) => {
  root.innerHTML = ''
  const currentState = snapshot(state)
  const items = currentState.items.find(item => item.feedId === currentState.activeFeed)
  const h5El = document.createElement('h5')
  h5El.textContent = i18n.t('page.postsTitle')
  const ulEl = document.createElement('ul')
  ulEl.className = classNames('items-list')
  items.posts.forEach(item => {
    const title = document.createElement('span')
    title.textContent = item.title
    const link = document.createElement('a')
    link.target= '_blank'
    link.rel = 'noopener noreferrer'
    link.textContent = 'Просмотр'
    link.className = classNames('btn', 'btn-outline-primary', 'btn-sm')
    link.href = item.link
    const liEl = document.createElement('li')
    liEl.className = classNames('li-item')

    liEl.append(title, link)
    ulEl.append(liEl)
  })
  root.append(h5El, ulEl) 
}

async function  runApp (i18n) {
const divEl = document.getElementById('div-form')
const feedsDiv = document.getElementById('feeds')
const postDiv = document.getElementById('posts')
renderHead(divEl, state, i18n)

subscribe(state.form, () => {
  renderHead(divEl, state, i18n)
})
subscribe(state.feeds, () => {
  renderFeeds(feedsDiv, state, i18n)
})
subscribe(state.items, () => {
  renderItems(postDiv, state, i18n)
})
}

const i18nextInstance = i18next.createInstance()
await i18nextInstance.init({
  lng: state.ui,
  dubug: true,
  resources
})

yup.setLocale({
  string: {
    url:  i18nextInstance.t('messages.url')
  },
})
const validationSchema = yup.object().shape({
  link: yup.string().url()
})

runApp(i18nextInstance)
