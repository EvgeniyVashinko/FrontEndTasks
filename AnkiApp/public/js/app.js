"use strict";

import utils from './services/utils.js'
import header from './views/header.js'
import error404 from './views/error404.js';
import home from './views/home.js';
import cards from './views/cards.js';
import card from './views/card.js';
import collections from './views/collections.js';
import collection from './views/collection.js';
import startCollection from './views/startCollection.js';
import createCollection from './views/createCollection.js';
import login from './views/login.js';
import register from './views/register.js';
import unauthorizedHeader from './views/unauthorizedHeader.js';
import unauthorized from './views/unauthorized.js';
import deleteCollection from './views/deleteCollection.js';
import deleteCard from './views/deleteCard.js';
import logout from './views/logout.js';

const routes = {
    '/'                         : home,
    '/cards'                    : cards,
    '/card/:id/edit'            : card,
    '/card/:id/delete'          : deleteCard,
    '/collections'              : collections,
    '/collection/:id/start'     : startCollection,
    '/collection/:id/edit'      : collection,
    '/collection/:id/delete'    : deleteCollection,
    '/create-collection'        : createCollection,
    '/create-card'              : card,
    '/login'                    : login,
    '/register'                 : register,
    '/logout'                   : logout,
};


const router = async () => {
    let request = utils.parseRequestURL();
    
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '');
    // console.log(parsedURL);

    const headerContent = null || document.getElementById('header');
    if (isAuthorizedUser()){
        headerContent.innerHTML = await header.render();
        await header.after_render();
    }
    else{
        headerContent.innerHTML = await unauthorizedHeader.render();
        await unauthorizedHeader.after_render();
    }

    const content = null || document.getElementById('main');
    let page;
    if(isAuthorizedUser() || request.resource == 'login' || request.resource == 'register'){
        page = routes[parsedURL] ? routes[parsedURL] : error404;
    }
    else{
        page = unauthorized;
    }

    content.innerHTML = await page.render();
    await page.after_render();
}

function isAuthorizedUser(){
    return localStorage.getItem('uid') != null;
}

window.addEventListener('hashchange', router);

window.addEventListener('load', router);