import * as yup from 'yup'
import { subscribe, snapshot, proxy } from 'valtio/vanilla'
import  globalState from './state.js'
import i18next from 'i18next'
import { resources } from './resources.js'
import classNames from 'classnames'

const state = proxy(globalState)


  const validation =  (value, i18n) => {
      const { link } = value
    validationSchema.validate(value).then(() => {
      if(!hasFeed(link)){
      state.feeds.push(link)
      state.form.validation.status = 'passed'
      state.form.validation.message = i18n.t('messages.added')
      state.form.process.value = ''
      }
      else {
      state.form.validation.status = 'notPassed'
      state.form.validation.message = i18n.t('messages.exist')
      state.form.process.value = link
            }
    }).catch((e) => {
      state.form.validation.status = 'notPassed'
      state.form.validation.message = e.message
      state.form.process.value = link
    })
  }


  const hasFeed = (feed) => {
  const result = state.feeds.filter(el => el === feed)
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
    default:
      el.textContent = ''
  }
 }

 const render = (root, state, i18n) => {
  const currentState = snapshot(state)
  console.log('CURRENT STATE:', currentState)
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
  // inputText.className = 'input form-control'
  inputText.id = 'floatingInput'
  inputText.className = cn
  inputText.name = 'link'
  inputText.value = currentState.form.process.value
   // if (currentState.form.validation.status === 'passed') {
  //   inputText.classList.add('is-valid')
  // }
  // if (currentState.form.validation == 'notPassed') {
  //   inputText.classList.add('is-invalid')
  // }
  // if (currentState.form.process.status === 'exist') {
  //   inputText.value = currentState.form.value
  // }

  const labelEl = document.createElement('label')
  labelEl.setAttribute('for', 'floatingInput')  
  labelEl.textContent = i18n.t('page.label')

  const inputBtn = document.createElement('input')
  inputBtn.type = 'submit'
  inputBtn.classList.add('btn', 'btn-ligt', 'button-cs')
  inputBtn.value = i18n.t('page.button')

  root.innerHTML = ''
  root.appendChild(h1El)
  root.appendChild(pEl)
  formEl.appendChild(inputText)
  formEl.appendChild(labelEl)
  formEl.appendChild(inputBtn)
  root.appendChild(formEl)
  root.appendChild(h6El)
  if (commentEl){
    root.appendChild(commentEl)
  }

  formEl.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(formEl)
    const link = data.get('link').trim()
    validation({ link }, i18n)
  })

  formEl.addEventListener('focusout', () => {
    // state.form.validation = null
    // state.form.process.status = null
    console.log('STATE', currentState)
  })

}

function runApp (i18n) {
const divEl = document.getElementById('div-form')
render(divEl, state, i18n)

subscribe(state, () => {
  render(divEl, state, i18n)
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
