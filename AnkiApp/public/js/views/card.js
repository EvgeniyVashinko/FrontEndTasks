import utils from '../services/utils.js'

let card = {
    render : async () => {
        let view =  
        `<form id="form" class="card-form">
            <section class="cards">
                <div class="card big">
                    <h2>Front</h2>
                    <input id="name1" class="form__input form__input-narrow" type="text" autocomplete="off" placeholder="Name">
                </div>

                <div class="card big">
                    <h2>Back</h2>
                    <input id="name2" class="form__input form__input-narrow" type="text" autocomplete="off" placeholder="Name">
                </div>
            </section>
            <section class="card-option">
                <label>Set a collection</label>
                <select id="select">
                    
                </select>
                <button id="add-button" class="form__submit" type="submit">Save</button>
            </section>
        </form>`
        return view
    }
    , after_render: async () => {
        const fbRef = firebase.database().ref();
        const colRef = fbRef.child(localStorage.getItem('uid')).child('collections');
        const cardsRef = fbRef.child(localStorage.getItem('uid')).child('cards');

        const form = document.getElementById('form')
        form.addEventListener('submit', function(e){
            e.preventDefault();
        });

        const frontInput = form.querySelector('#name1');
        const backInput = form.querySelector('#name2');
        const select = form.querySelector('#select');

        const request = utils.parseRequestURL();

        colRef.on('value', function(snapshot){
            const s = snapshot.val();
            for(let colId in s){
                let option = new Option(s[colId].name, colId);
                select.append(option);
            }
        })
        
        if(request.id != null){
            let cardRef = cardsRef.child(request.id);
            cardRef.on('value', function(snapshot){
                const card = snapshot.val();
                frontInput.value = card.frontValue;
                backInput.value = card.backValue;
                select.value = card.collectionId;
            })
        }

        const addBtn = document.getElementById('add-button');
        addBtn.addEventListener('click', function(e){
            let id = request.id != null ? request.id : cardsRef.push().key;
            cardsRef.child(id).update({
                frontValue: frontInput.value.trim(),
                backValue: backInput.value.trim(),
                collectionId: select.value,
            })
            history.back();
        })

    }
}

export default card;