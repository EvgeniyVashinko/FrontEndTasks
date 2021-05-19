const register = {
    render : async () => {
        const view =  
        `<dialog id="dialog">
            <form id="register-form">
                <fieldset>
                    <legend class="form__name">Register</legend>
                    <input id="email-input" class="form__input" type="text" placeholder="Email">
                    <input id="password-input" class="form__input" type="password" placeholder="Password">
                    <button id="submit-button" class="form__submit" type="submit">Register</button>
                </fieldset>
            </form>
        </dialog>`
        return view
    }
    , after_render: async () => {
        const dialog = document.getElementById('dialog');
        dialog.showModal();

        const form = dialog.querySelector('#register-form')
        form.addEventListener('submit', function(e){
            e.preventDefault();
        })

        const emailInput = dialog.querySelector('#email-input');
        const passwordInput = dialog.querySelector('#password-input');
        const submitButton = dialog.querySelector('#submit-button');
        submitButton.addEventListener('click', function(e){
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
                dialog.close();
                window.location.replace('#/')  
            }).catch((error) =>{
                let errorCode = error.code;
                let errorMessage = error.message;
            });
        })
    }
}

export default register;