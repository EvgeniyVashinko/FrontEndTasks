let header = {
    render : async () => {
        let view =  
        `<div>
            <a href="#/" id="logo">AnkiApp</a>
        </div>

        <nav>
            <a href="#/">Home</a>
            <a href="#/collections">Collections</a>
            <a href="#/cards">Cards</a>
            <a href="#/logout">Log out</a>
        </nav>`

        return view
    }
    , after_render: async () => {
    }
}

export default header;