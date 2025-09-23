"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");
zokou({ nomCom: "ney", reaction: "💋", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
    console.log("Commande saisie !!!s");
    let z = 'Hello my name is  *Neyraa Nei* \n\n ' + "i'm a wife of *LeonardTech 😊💞 ";
    let d = ' by *my owner*';
    let varmess = z + d;
    var img = 'https://files.catbox.moe/04qe9z.jpg';
    await zk.sendMessage(dest, { image: { url: img }, caption: varmess });
    //console.log("montest")
});
console.log("mon ney");
/* one love