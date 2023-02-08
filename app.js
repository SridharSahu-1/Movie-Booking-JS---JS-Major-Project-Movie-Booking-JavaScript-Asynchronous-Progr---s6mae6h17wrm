import {fetchMovieAvailability,fetchMovieList} from "./api.js"
let main = document.getElementById('main');
let booker = document.getElementById('booker')
let bookergridholder = document.getElementById('booker-grid-holder')
let bookticketbtn = document.getElementById('book-ticket-btn')

window.addEventListener('load',()=>{
    fetchMovieList().then((res)=>{
        // console.log(res)
        removeLoader()
        displayMovies(res);
    })
})
function removeLoader(){  
    let loader =  document.getElementById('loader')
   if(loader){
    loader.remove()
   }
}

function displayMovies(movieslists){
    let movieholder = document.createElement('div')
    movieholder.className = 'movie-holder'
    movieslists.forEach((element,index) => {
        let a = document.createElement('a')
        a.className = 'movie-link'
        a.href = `#${element.name}`
        a.id = `movie-${index}`
        
        let divmovieName = document.createElement('div');
        divmovieName.className = 'movie';
        divmovieName.setAttribute('data-d','moviename');

        let imgwrapper = document.createElement('div');
        imgwrapper.className = 'movie-img-wrapper';
        imgwrapper.style.backgroundImage = `url("${element.imgUrl}")`

        let h4moviename = document.createElement('h4')
        h4moviename.textContent = `${element.name}`

        divmovieName.append(imgwrapper);
        divmovieName.append(h4moviename);

        a.append(divmovieName);

        movieholder.appendChild(a);
    });
    main.append(movieholder)

    eventaddonMovies()
}

    
eventaddonMovies()
    
function eventaddonMovies() {
        let movielinks = document.querySelectorAll('.movie-link')
   
        for(let movielink of movielinks){
            movielink.addEventListener('click',(e)=>{
                booker.children[0].classList.remove('v-none')
                bookergridholder.innerHTML = `<div id='loader'>Loading..</div>`
                let movieName;
                if(e.target.tagName === 'H4'){
                    movieName = e.target.innerText
                }
                else if(e.target.nextElementSibling.tagName === 'H4'){
                    movieName = e.target.nextElementSibling.innerText
                }
                resetseats()
                getSetas(movieName)
            })
        } 
}
let SelectedSeat = [];
function getSetas(moviname){
    fetchMovieAvailability(moviname).then((res)=>{
        // console.log(res)
        removeLoader()
        displaySets(res)
    })
}

function displaySets(seatsdata){
    let grids = document.getElementById('booker-grid-holder')
    // if(!grids){
    //     let h3 = document.createElement('h3')
    //     h3.textContent = 'Seat Selector'

    //     let div = document.createElement('div')
    //     div.id = 'booker-grid-holder'

    //     let btn = document.createElement('button')
    //     btn.id = 'book-ticket-btn'
    //     btn.className = 'v-none';
    //     btn.textContent = 'Book my seats'

    //     booker.innerHTML = ''
    //     SelectedSeat = [];
    //     booker.append(h3)
    //     booker.append(div)
    //     booker.append(btn)
    // }
    let leftBox =document.createElement('div')
    let rightBox =document.createElement('div')

    leftBox.className = 'booking-grid';
    rightBox.className = 'booking-grid';

    for(let i=1; i<=12; i++){
        // console.log(seatsdata.includes(i))
        let divcell = document.createElement('div')
        divcell.id = `booking-grid-${i}`;
        if(seatsdata.includes(i)){
            divcell.className = 'seat unavailable-seat'
        }
        else{
            divcell.className = 'seat available-seat'
        }
        divcell.innerText = i;

        leftBox.append(divcell);
    }
    for(let i=13; i<=24; i++){
        let divcell = document.createElement('div')
        divcell.id = `booking-grid-${i}`;
        if(seatsdata.includes(i)){
            divcell.className = 'seat unavailable-seat'
        }
        else{
            divcell.className = 'seat available-seat'
        }
        divcell.innerText = i;

        rightBox.append(divcell);
    }
    // let bookergridholder = document.getElementById('booker-grid-holder')
    // bookergridholder.innerHTML = ''
    bookergridholder.append(leftBox)
    bookergridholder.append(rightBox)
}



if(bookergridholder){
    bookergridholder.addEventListener('click',(e)=>{
        if(e.target.classList.contains('available-seat')){
            let seatid =  e.target.id.split('-')[2];
            if(SelectedSeat.includes(seatid)){
                // SelectedSeat.remove(seatid)
                let index = SelectedSeat.indexOf(seatid);
                SelectedSeat.splice(index,1);
            }
            else{
                SelectedSeat.push(seatid)
            }
            e.target.classList.toggle('selected-seat')
        }
        
        if(SelectedSeat.length > 0){
            bookticketbtn.classList.remove('v-none')
        }
        else{
            bookticketbtn.classList.add('v-none')
            
        }
    })
}


function resetseats(){
    SelectedSeat = [];
    bookticketbtn.classList.add('v-none');
}



bookticketbtn.addEventListener('click',(e)=>{
    booker.innerHTML = ''
    Createcomfirmbooking()
})



function Createcomfirmbooking(){
    // booker.setAttribute('id','confirm-purchase')
    let div = document.createElement('div')
    div.id = 'confirm-purchase'

    let h3 = document.createElement('h3')
    h3.textContent = `Confirm your booking for seat numbers:${SelectedSeat.join(",")}`

    div.append(h3);

    let form = document.createElement('form')
    form.method = 'post'
    form.id = "customer-detail-form";
  

    let fromgroupem = document.createElement('div')
    fromgroupem.className = 'form-group'

    let emaillable = document.createElement('label')
    emaillable.setAttribute('for','email')
    emaillable.textContent = 'Email '

    let inputEmail = document.createElement('input')
    inputEmail.type = 'email';
    inputEmail.id = 'email'
    inputEmail.required = true;

    fromgroupem.append(emaillable)
    fromgroupem.append(inputEmail)

    let fromgroupph = document.createElement('div')
    fromgroupph.className = 'form-group'

    let phoneable = document.createElement('label')
    phoneable.setAttribute('for','tel')
    phoneable.textContent = 'Phone number '

    let inputPhone = document.createElement('input')
    inputPhone.type = 'tel';
    inputPhone.id = 'phone'
    inputPhone.required = true;

    fromgroupph.append(phoneable)
    fromgroupph.append(inputPhone)

    
    let inputbuton = document.createElement('button')
    inputbuton.type = 'submit';
    inputbuton.id = 'submitBtn'
    inputbuton.textContent = 'purchase'

    form.append(fromgroupem)
    form.append(fromgroupph)
    form.append(inputbuton)

    div.append(form)
    
    booker.append(div)

    addeventonform()
}

let userdetails = new Object()
function addeventonform(){
    let myform = document.getElementById('customer-detail-form')  
        myform.addEventListener('submit',(e)=>{
            e.preventDefault();
            console.log(e.target.children[0].lastElementChild)
            let email = e.target.children[0].lastElementChild.value;
            let phone  = e.target.children[1].lastElementChild.value;
            userdetails.seats = SelectedSeat.join(',');
            userdetails.email = email;
            userdetails.phone = phone;

            booker.innerHTML = ''
            bookingdeatails();
        })    
}
    



function bookingdeatails(){
    // booker.setAttribute('id','Success');
    let div = document.createElement('div')
    div.id = 'success'

    let h3 = document.createElement('h3')
    h3.textContent = 'Booking details'

    let divseat = document.createElement('p')
    divseat.innerHTML = `Seats: ${userdetails.seats}`
    let divphone = document.createElement('p')
    divphone.innerHTML = `Phone number: ${userdetails.phone}`
    let divemail = document.createElement('p')
    divemail.innerHTML = `Email: ${userdetails.email}`

    div.append(h3)
    div.append(divseat)
    div.append(divemail)
    div.append(divphone)

    booker.append(div);
}



















//this all code written by Prabhjot Rihal