let home = {
    render : async () => {
        let view =  
        `<h1 class="text-center text">Welcome, User</h1>
        <section class="statistics">
            <article class="card collection-item stat">
            <p><strong id="val1">0</strong> collections completed</p>
            </article>

            <article class="card collection-item stat">
                <p><strong id="val2">0</strong> cards memorized</p>
            </article>

            <article class="card collection-item stat">
                <p><strong id="val3">0</strong> cards completed</p>
            </article>

            <article class="card collection-item stat">
                <p><strong id="val4">0</strong> seconds spent</p>
            </article>
        </section>
        <section class="collection">
            <h2 class="text-center">Recomendation</h2>
            <ul id="col-list" class="collection-list">
            </ul>
        </section>`
        return view
    }
    , after_render: async () => {
        const fbRef = firebase.database().ref();
        const uRef = fbRef.child(localStorage.getItem('uid'));
        const colRef = uRef.child('collections');
        const cardsRef = uRef.child('cards');

        const stat1 = document.getElementById('val1');
        const stat2 = document.getElementById('val2');
        const stat3 = document.getElementById('val3');
        const stat4 = document.getElementById('val4');

        const colList = document.getElementById('col-list');

        uRef.child('statistics').on('value', function(snapshot){
            const s = snapshot.val();
            if (s != null){
                stat1.textContent = s['completedCollections'] == null ? 0 : s['completedCollections'];
                stat2.textContent = s['memorizedСards'] == null ? 0 : s['memorizedСards'];
                stat3.textContent = (s['memorizedСards'] == null ? 0 : s['memorizedСards']) + 
                                    (s['failedСards'] == null ? 0 : s['failedСards']);
                stat4.textContent = s['timeSpent'] == null ? 0 : s['timeSpent'];
            }
        })
        
        const collections = [];
        colRef.on('value', function(snapshot){
            const s = snapshot.val();
            for (let colId in s){
                collections.push({
                    colId: colId,
                    name: s[colId]['name'],
                    memorizedСards: s[colId]['memorizedСards'],
                    failedСards: s[colId]['failedСards'],
                    completedNum: s[colId]['completedNum']
                })
            }

            cardsRef.on('value', function(snapshot){
                let ids = [];
                if(snapshot.val() != null){
                    const s = Object.values(snapshot.val()).map(el => el['collectionId']);
                    ids = [...new Set(s)];
                }

                const recomendation = collections.filter(x => ids.indexOf(x.colId) != -1).sort(function(a, b){
                    return calculateCoefficient(a) - calculateCoefficient(b) ;
                }).slice(0, 8);

                for(let o of recomendation){
                    colList.insertAdjacentHTML("beforeend", GetElement(o.name, o.colId));
                }

                function calculateCoefficient(e){
                    let cardsNum = e.memorizedСards + e.failedСards
                    return e.completedNum * e.memorizedСards / ((cardsNum == 0 ? 1 : cardsNum))
                }
            })
        })

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

export default home;