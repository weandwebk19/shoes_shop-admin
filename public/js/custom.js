const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const btnAdd = $('.btn-add');
const formAdd = $('.needs-validation');

let isHidden = true;

btnAdd.onclick = function() {
    isHidden = !isHidden;
    formAdd.classList.toggle('hidden', isHidden);
}

function addClassByClick(button){
    button.classList.add("active");
}