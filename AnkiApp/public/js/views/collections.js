let collections = {
    render : async () => {
        let view =  
        `<h1>My collections</h1>
        <button id="add-button">Add</button>
        <section class="collection">
            <ul id="col-list" class="collection-list">
            </ul>
        </section>`
        return view
    }
    ,after_render: async () => {
        const fbRef = firebase.database().ref();
        const colRef = fbRef.child(localStorage.getItem('uid')).child('collections');

        const addBtn = document.getElementById('add-button');
        addBtn.addEventListener('click', function(e){
            window.location.replace('#/create-collection');
        })

        let colList = document.getElementById('col-list');
        colRef.on('value', function(snapshot){
            for (let colId in snapshot.val()){
                colList.insertAdjacentHTML("afterbegin", GetElement(snapshot.child(colId).val().name, colId));
            }
        });

        function GetElement(name, id){
            let elem = 
            `<li>
                <article class="card collection-item">
                    <h3>${name}</h3>
                    <button onclick="window.location='/#/collection/${id}/start'" class="btn start">Start</button>
                    <button onclick="window.location='/#/collection/${id}/edit'" class="btn edit">Edit</button>
                    <button onclick="window.location='/#/collection/${id}/delete'" class="btn delete">Delete</button>
                </article>
            </li>`;

            return elem;
        }

    }
}

export default collections;