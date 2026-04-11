import { object, string } from 'yup'
import { subscribe, snapshot, proxy } from 'valtio/vanilla'

const validationSchema= object({
  link: string().url()
})

const feeds = []
  const hasFeed = (feed) => {
  const result = feeds.filter(el => el === feed)
    if (result.length > 0) {
      return true
    }
    else {
      return false
    }
  
}
  const validation =  (value) => {
    validationSchema.validate(value).then(() => {
      state.form.validation = true
      const { link } = value
      if(!hasFeed(link)){
      feeds.push(link)
      state.comment.status = 'added'
      }
      else {
      state.comment.status = 'exist'
      state.form.validation = false
      state.form.value = link
            }
    }).catch(() => {
      state.form.validation = false
      state.comment.status = 'badLink'
    })
  }

const state = proxy({
  form: {
      validation: null,
      value: ''
    },
  comment: {
    status: null,
  }
})

const getValidationStatus = () => {
  const vStatus = snapshot(state)
  switch(vStatus){
    case false: {
      return ''
    }
  }
}

const render = (root, state) => {
  const currentState = snapshot(state)
  const h1El = document.createElement('h1')
  h1El.textContent = 'RSS Агрегатор'

  const pEl = document.createElement('p')
  pEl.textContent = 'Начните читать RSS сегодня! Это быстро и красиво.'

  const h6El = document.createElement('h6')
  h6El.classList.add('comment')
  h6El.textContent = 'Пример: https://lorem-rss.hexlrt.app/feed'

  const commentEl = document.createElement('h6')
  if(currentState.comment.status !== null) {
    if(currentState.comment.status === 'badLink'){
  commentEl.classList.add('red')
  commentEl.textContent = 'Не верный формат ссылки'
    }
    if(currentState.comment.status === 'added'){
  commentEl.classList.add('green')
  commentEl.textContent = 'RSS успешно загружен'
    }
    if(currentState.comment.status === 'exist'){
  commentEl.classList.add('red')
  commentEl.textContent = 'RSS уже существует'
    }
  }
  
  const formEl = document.createElement('form')
  formEl.id = 'form'
  formEl.action = ''
  formEl.className = 'form-floating'
  

  const inputText = document.createElement('input')
  inputText.type = 'text'
  inputText.className = 'input form-control'
  inputText.id = 'floatingInput'
  if (currentState.form.validation === true) {
    inputText.classList.add('is-valid')
  }
  if (currentState.form.validation == false) {
    inputText.classList.add('is-invalid')
  }
  if (currentState.comment.status === 'exist') {
    inputText.value = currentState.form.value
  }
  // else{
  // inputText.placeholder =  'RSS ссылка' 
  // }
  inputText.name = 'link'

  const labelEl = document.createElement('label')
  labelEl.setAttribute('for', 'floatingInput')  
  labelEl.textContent = 'RSS ссылка'

  const inputBtn = document.createElement('input')
  inputBtn.type = 'submit'
  inputBtn.classList.add('btn', 'btn-ligt', 'button-cs')
  inputBtn.value = 'Добавить'

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
    validation({ link }, state)
  })

  formEl.addEventListener('focusout', () => {
    state.form.validation = null
    state.comment.status = null
  })

}
const divEl = document.getElementById('div-form')
render(divEl, state)

subscribe(state, () => {
  render(divEl, state)
})
