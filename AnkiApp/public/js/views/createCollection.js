let createCollection = {
    render : async () => {
        let view =  
        `<dialog id="dialog">
            <form id="create-collection-form">
                <fieldset>
                    <legend class="form__name">Create collection</legend>
                    <input id="name-input" class="form__input" type="text" placeholder="Name">
                    <button id="submit-button" class="form__submit" type="submit">Create</button>
                </fieldset>
            </form>
        </dialog>`
        return view
    }
    , after_render: async () => {
        const fbRef = firebase.database().ref();
        const colRef = fbRef.child(localStorage.getItem('uid')).child('collections');

        const dialog = document.getElementById('dialog');
        dialog.showModal();

        const form = dialog.querySelector('#create-collection-form')
        form.addEventListener('submit', function(e){
            e.preventDefault();
        });

        const nameInput = form.querySelector('#name-input');
        const submitButton = form.querySelector('#submit-button');
        submitButton.addEventListener('click', function(e){
            let name = nameInput.value.trim();

            colRef.push({
                name: name, 
                completedNum: 0,
                memorizedСards: 0,
                failedСards: 0,               
            })
            
            dialog.close();
            window.location.replace('#/collections')  
        })
    }
}

export default createCollection;