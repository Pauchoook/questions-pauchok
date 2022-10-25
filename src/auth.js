import { Question } from "./question";
import { createModal } from "./utils";

export function getAuthForm() {
   return `
   <form class="mui-form" id="form-auth">
      <div class="mui-textfield mui-textfield--float-label">
         <input id="email" type="email">
         <label for="email">Почта</label>
      </div>
      <div class="mui-textfield mui-textfield--float-label">
         <input id="password" type="password" required minlength="6">
         <label for="password">Пароль</label>
      </div>
      <button type="submit" id="btn-auth" class="mui-btn mui-btn--raised mui-btn--primary" disabled>Войти</button>
   </form>
   `
}

export function authFormHandler(e) {
   e.preventDefault();

   const btn = e.target.querySelector('button');
   const email = e.target.querySelector('#email').value;
   const password = e.target.querySelector('#password').value;

   btn.disabled = true;
   localStorage.setItem('auth', true);
   localStorage.setItem('email', email);
   localStorage.setItem('password', password);
   console.log('auth');

   authorization(email, password)
      .then(token => Question.fetch(token))
      .then(renderAfterAuth)
      .then(() => btn.disabled = false)
}

export function renderAfterAuth(content) {
   if (typeof content === 'string') {
      alert(content);
   } else {
      createModal('Список ВСЕХ вопросов', Question.questionsHtml(content));
   }
}

export function authorization(email, password) {
   const apiKey = 'AIzaSyBQS6seJ3HgKCJLjmdo30vBBsElQbLBjaU';
   return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
         email,
         password,
         returnSecureToken: true
      }),
      headers: {
         'Content-Type': 'application/json'
      }
   })
      .then(response => response.json())
      .then(data => data.idToken);
}