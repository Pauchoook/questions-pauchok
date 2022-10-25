export function isValid(input) {
   const length = input.getAttribute('minlength');
   console.log(length);
   return input.value.length >= length;
}

export function createModal(title, htmlContent) {
   const modal = document.createElement('div');
   modal.classList.add('modal');

   modal.innerHTML = `
      <h1>${title}</h1>
      <div class="modal-content">${htmlContent}</div>
   `

   mui.overlay('on', modal);
}