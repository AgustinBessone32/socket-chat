
const miForm = document.querySelector('form')
const url = 'http://localhost:8080/api/auth/'

miForm.addEventListener('submit', ev => {
    ev.preventDefault()

    const formData = {}

    for(let el of miForm.elements){
        if(el.name.length > 0){
            formData[el.name] = el.value
        }
    }


    fetch(url + 'login',{
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(({token,msg}) =>{
        if(msg){
            return console.error(msg)
        }
        localStorage.setItem('token',token)
        window.location = 'chat.html'
    })
    .catch(err => {
        console.log(err)
    })
})

function handleCredentialResponse(response) {

    const body = { id_token: response.credential }

    fetch(url+ 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(({token}) => {
            localStorage.setItem('token',token)
            window.location = 'chat.html'
        })
        .catch(err => console.log(err))
    //Google token
}

const button = document.getElementById('google-signout')

button.onclick = () => {
    google.accounts.id.disableAutoSelect()

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear()
        location.reload()
    })
}