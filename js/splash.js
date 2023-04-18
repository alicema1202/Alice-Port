let intro = document.querySelector('.introduction');
let logo = document.querySelector('.logo-header');
let logoSpan = document.querySelectorAll('.logoo');
// let word1 = document.querySelector('.word1');
// let word2 = document.querySelector('.word2');

window.addEventListener('DOMContentLoaded', ()=>{
    setTimeout(()=>{
        logoSpan.forEach((span, idx)=>{
            setTimeout(()=>{
                span.classList.add('active');
            }, (idx + 1) * 400)
        })
        setTimeout(()=> {
            logoSpan.forEach((span, idx)=> {
                setTimeout(()=>{
                    span.classList.remove('active');
                    span.classList.add('fade');
                }, (idx + 1)*100)
            })
        },2500)
    })

    setTimeout(()=> {
        intro.style.top='-100vh';
    }, 2900);
})  
