let unauthorized = {
    render : async () => {
        let view =  
        `<section class="unreg-section">
            <button id="get-started" onclick="window.location='/#/register'" class="btn">Get Started</button>
        </section>`
        return view
    }
    , after_render: async () => {
    }
}

export default unauthorized;