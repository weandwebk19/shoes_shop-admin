const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const btnAdd = $('.btn-add');
const formAdd = $('.needs-validation');

let isHidden = true;

try {
    btnAdd.onclick = function() {
        isHidden = !isHidden;
        formAdd.classList.toggle('hidden', isHidden);
    }
}
catch (err) {}


function addClassByClick(button){
    button.classList.add("active");
}