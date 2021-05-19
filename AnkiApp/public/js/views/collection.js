import utils from '../services/utils.js'

let collection = {
    render : async () => {
        let view =  
        `<h1>Collection</h1>
        <form id="form">
            <input id="name-input" class="form__input" type="text" placeholder="Name">
            <button id="submit-button" class="form__submit" type="submit">Save</button>
        </form>
        <section class="collection">
            <ul id="card-list" class="collection-list">
            </ul>
        </section>`
        return view
    }
    , after_render: async () => {
        const fbRef = firebase.database().ref();
        const colRef = fbRef.child(localStorage.getItem('uid')).child('collections');
        const cardsRef = fbRef.child(localStorage.getItem('uid')).child('cards');

        const request = utils.parseRequestURL();

        const form = document.getElementById('form')
        form.addEventListener('submit', function(e){
            e.preventDefault();
        });

        const nameInput = form.querySelector('#name-input');
        colRef.child(request.id).on('value', function(snapshot){
            nameInput.value = snapshot.val().name;
        })

        const submitButton = form.querySelector('#submit-button');
        submitButton.addEventListener('click', function(e){
            let name = nameInput.value.trim();
            colRef.child(request.id).update({
                name: name,                
            });
        })

        const cardList = document.getElementById('card-list');
        cardsRef.on('value', function(snapshot){
            const s = snapshot.val();
            for (let cardId in s){
                if(s[cardId]['collectionId'] == request.id){
                    cardList.insertAdjacentHTML("afterbegin", GetElement(s[cardId]['frontValue'], cardId));
                }
            }
        });

        function GetElement(name, id){
            let elem = 
            `<li>
                <article class="card collection-item">
                    <h3>${name}</h3>
                    <button onclick="window.location='/#/card/${id}/edit'" class="btn edit">Edit</button>
                    <button onclick="window.location='/#/card/${id}/delete'" class="btn delete">Delete</button>
                </article>
            </li>`;

            return elem;
        }
    }
}

export default collection;