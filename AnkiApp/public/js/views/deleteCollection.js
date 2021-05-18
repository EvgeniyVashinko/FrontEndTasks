import utils from '../services/utils.js'

let deleteCollection = {
    render : async () => {
        let view =``;
        return view
    }
    , after_render: async () => {
        const fbRef = firebase.database().ref();
        let id = firebase.auth().currentUser.uid;
        const colRef = fbRef.child(id).child('collections');

        let request = utils.parseRequestURL()
        colRef.child(request.id).remove();

        window.location.replace('#/collections');
    }
}

export default deleteCollection;