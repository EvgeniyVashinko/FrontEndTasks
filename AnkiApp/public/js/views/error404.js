let error404 = {
    render : async () => {
        let view =  
        `<h1 class="text-center">404 Error</h1>`
        return view
    }
    , after_render: async () => {
    }
}

export default error404;