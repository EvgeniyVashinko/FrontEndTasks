let login = {
    render : async () => {
        let view =  
        `<dialog id="dialog">
            <form id="login-form">
                <fieldset>
                    <legend class="form__name">Log in</legend>
                    <input id="email-input" class="form__input" type="text" placeholder="Email">
                    <input id="password-input" class="form__input" type="password" placeholder="Password">
                    <button id="submit-button" class="form__submit" type="submit">Log in</button>
                </fieldset>
            </form>
        </dialog>`
        return view
    }
    , after_render: async () => {
        const dialog = document.getElementById('dialog');
        dialog.showModal();

        const form = dialog.querySelector('#login-form')
        form.addEventListener('submit', function(e){
            e.preventDefault();
        })

        const emailInput = dialog.querySelector('#email-input');
        const passwordInput = dialog.querySelector('#password-input');
        const submitButton = dialog.querySelector('#submit-button');
        submitButton.addEventListener('click', function(e){
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
                dialog.close();
                window.location.replace('#/')  
            }).catch((error) =>{
                let errorCode = error.code;
                let errorMessage = error.message;
            });
        })
    }
}

export default login;