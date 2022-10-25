// логика и сущности запросов

export class Question {
   static create(question) {
      return fetch('https://app-question-eff9f-default-rtdb.firebaseio.com/questions.json', {
         method: 'POST',
         body: JSON.stringify(question),
         headers: {
            'Content-Type': 'application/json'
         }
      })
         .then(response => response.json())
         .then(response => {
            question.id = response.name;
            return question;
         })
         .then(addLocalStorage)
         .then(Question.renderList)
   }

   static fetch(token) {
      if (!token) {
         return Promise.resolve('Проблема в токене')
      }
      return fetch(`https://app-question-eff9f-default-rtdb.firebaseio.com/questions.json?auth=${token}`)
         .then(response => response.json())
         .then(response => {
            if (response && response.error) {
               return `<p class="error">${response.error}</p>`;
            }

            return response ? Object.keys(response).map(key => ({
               ...response[key],
               id: key
            })) : [];
         })
   }

   static renderList() {
      const questions = getQuestionLocalSotrage();

      const html = questions.length
         ? questions.map(toCard).join('')
         : `<div class="mui--text-headline">Вопросов пока нет</div>`;

      const list = document.getElementById('list');
      list.innerHTML = html;
   }

   static questionsHtml(questions) {
      return questions.length
         ? `
         <ol>
            ${questions.map(q => `<li>${q.text}</li>`).join('')}
         </ol>`
         : '<p>Вопросов пока нет</p>'
   }
}

function addLocalStorage(question) {
   const allQ = getQuestionLocalSotrage();
   allQ.unshift(question);
   localStorage.setItem('questions', JSON.stringify(allQ));
}

function getQuestionLocalSotrage() {
   // получение всех вопросов с localStorage
   return JSON.parse(localStorage.getItem('questions') || '[]');
}

function toCard(question) {
   return `
      <div class="card">
         <div class="mui--text-black-54">
            ${new Date(question.date).toLocaleDateString()}
            ${new Date(question.date).toLocaleTimeString()}
         </div>
         <div>${question.text}</div
      </div>
      <br>
   `
}