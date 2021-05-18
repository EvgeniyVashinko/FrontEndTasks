let cards = {
    render : async () => {
        let view =  
        `<h1>My cards</h1>
        <button id="add-button">Add</button>
        <section class="collection">
            <ul id="card-list" class="collection-list">
            </ul>
        </section>`
        return view
    }
    , after_render: async () => {
        const fbRef = firebase.database().ref();
        const cardsRef = fbRef.child(localStorage.getItem('uid')).child('cards');

        const addBtn = document.getElementById('add-button');
        addBtn.addEventListener('click', function(e){
            window.location.replace('#/create-card');
        });

        const cardList = document.getElementById('card-list');
        cardsRef.on('value', function(snapshot){
            const s = snapshot.val();
            for (let cardId in s){
                cardList.insertAdjacentHTML("afterbegin", GetElement(s[cardId].frontValue, cardId));
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

export default cards;