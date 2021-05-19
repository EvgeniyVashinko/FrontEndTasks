let unauthorizedHeader = {
    render : async () => {
        let view =  
        `<div>
            <a href="#/" id="logo">AnkiApp</a>
        </div>

        <div>
            <button id="login" onclick="window.location='/#/login'" class="btn">Log in</button>
            <button id="register" onclick="window.location='/#/register'" class="btn">Register</button>
        </div>`
        return view
    }
    , after_render: async () => {
    }
}

export default unauthorizedHeader;