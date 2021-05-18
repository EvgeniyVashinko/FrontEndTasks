import utils from '../services/utils.js'

let startCollection = {
    render : async () => {
        let view =  
        `<section id="section" class="container">
            <div>
                <h2>Cards left: <span id="cards-left"></span></h2>
                <h2>Time: <span id="time">0</span></h2>
            </div>
            <article id="card" class="card card__process">
                <h2 id="card-value"></h2>
            </article>
            <div class="btn-container">
                <button id="forgot-button" class="btn btn-process">Forgot</button>
                <button id="remember-button" class="btn btn-process">Remember</button>
            </div>
        </section>`
        return view
    }
    , after_render: async () => {
        const fbRef = firebase.database().ref();
        const cardsRef = fbRef.child(localStorage.getItem('uid')).child('cards');
        const colRef = fbRef.child(localStorage.getItem('uid')).child('collections');
        const statRef = fbRef.child(localStorage.getItem('uid')).child('statistics');

        const request = utils.parseRequestURL();

        const cardsLeft = document.getElementById('cards-left');
        const time = document.getElementById('time');
        const cardValue = document.getElementById('card-value');
        const forgotButton = document.getElementById('forgot-button');
        const rememberButton = document.getElementById('remember-button');
        hideButtons();
        const card = document.getElementById('card');

        const cards = [];
        let currentCard;
        let memorizedСardsNum = 0;
        let failedСardsNum = 0;
        cardsRef.on('value', function(snapshot){
            const s = snapshot.val();
            for (let cardId in s){
                if(s[cardId]['collectionId'] == request.id){
                    cards.push({
                        cardId: cardId,
                        frontValue: s[cardId]['frontValue'],
                        backValue: s[cardId]['backValue']
                    })
                }
            }

            if(cards.length != 0){
                window.timerId = window.setInterval(timer, 1000);
            }

            nextCard();
        });

        function nextCard(){
            if(cards.length == 0){
                end(memorizedСardsNum + failedСardsNum == 0);
                return;
            }
            hideButtons();
            currentCard = cards.pop();
            cardValue.textContent = currentCard.frontValue
            cardsLeft.textContent = cards.length;
        }

        function timer() {
            time.textContent = parseInt(time.textContent) + 1;
        }

        card.addEventListener('click', function(e){
            cardValue.textContent = currentCard.backValue;
            showButtons()
        })

        forgotButton.addEventListener('click', function(e){
            failedСardsNum++;
            statRef.update({
                failedСards: firebase.database.ServerValue.increment(1)
            })
            nextCard();
        })

        rememberButton.addEventListener('click', function(e){
            memorizedСardsNum++;
            statRef.update({
                memorizedСards: firebase.database.ServerValue.increment(1)
            })
            nextCard()
        })

        function hideButtons(){
            forgotButton.style.visibility = 'hidden';
            rememberButton.style.visibility = 'hidden';
        }

        function showButtons(){
            forgotButton.style.visibility = 'visible';
            rememberButton.style.visibility = 'visible'
        }

        function end(isEmptyCollection){
            if(!isEmptyCollection){
                window.clearInterval(window.timerId);
                document.getElementById('section').style.display = 'none';
                statRef.update({
                    completedCollections: firebase.database.ServerValue.increment(1),
                    timeSpent: firebase.database.ServerValue.increment(parseInt(time.textContent)),
                })
                colRef.child(request.id).update({
                    completedNum: firebase.database.ServerValue.increment(1),
                    memorizedСards: firebase.database.ServerValue.increment(memorizedСardsNum),
                    failedСards: firebase.database.ServerValue.increment(failedСardsNum),
                })
            }

            const text = isEmptyCollection ? 'Collection is empty' : 'Collection completed';
            const content = `<h1 class="text-center text">${text}</h1>
                            <section class="info-section">
                                <button id="back" onclick="window.location='/#/collections'" class="btn">Back to collections</button>
                            </section>`;
            document.getElementById('main').innerHTML = content;
        }
    }
}

export default startCollection;