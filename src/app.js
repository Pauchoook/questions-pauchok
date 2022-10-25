import { authFormHandler, authorization, getAuthForm, renderAfterAuth } from './auth';
import { Question } from './question';
import './style.css';
import { createModal, isValid } from './utils';

const form = document.querySelector('#form');
const input = form.querySelector('#question');
const btn = form.querySelector('#btn');
const questionsBtn = document.getElementById('btn-all')

questionsBtn.addEventListener('click', openQuestions);

window.addEventListener('load', () => Question.renderList());

form.addEventListener('submit', submitFormHandler);
input.addEventListener('input', () => {
   btn.disabled = !isValid(input)
});

function openQuestions() {
   if (localStorage.getItem('auth') === 'true') {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');

      authorization(email, password)
         .then(token => Question.fetch(token))
         .then(renderAfterAuth)
   } else {
      createModal('Авторизация', getAuthForm());
      const formAuth = document.querySelector('#form-auth');
      const inputPassword = formAuth.querySelector('#password')
      const btnAuth = formAuth.querySelector('#btn-auth');

      formAuth.addEventListener('submit', authFormHandler, {once: false});

      inputPassword.addEventListener('input', () => {
         btnAuth.disabled = !isValid(inputPassword);
      });
   }
}

function submitFormHandler(e) {
   e.preventDefault();

   if (isValid(input)) {
      // объект вопроса
      const question = {
         text: input.value.trim(),
         date: new Date().toJSON()
      }
      btn.disabled = true;

      // запрос на сервер для сохранения вопроса (question)
      Question.create(question).then(() => {
         input.value = '';
         input.className = '';
         btn.disabled = false;
      });
   }
}