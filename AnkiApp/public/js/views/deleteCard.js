import utils from '../services/utils.js'

let deleteCard = {
    render : async () => {
        let view =``;
        return view
    }
    , after_render: async () => {
        const fbRef = firebase.database().ref();
        let id = firebase.auth().currentUser.uid;
        const cardsRef = fbRef.child(id).child('cards');

        let request = utils.parseRequestURL()
        cardsRef.child(request.id).remove();

        history.back();
    }
}

export default deleteCard;