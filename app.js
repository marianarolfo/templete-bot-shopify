const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const axios = require('axios');

const flowBienvenida = addKeyword('Hola')
.addAnswer('Gracias por contactarnos')
.addAnswer('Escribe *productos* para conocer las ofertas')

const flowProducts = addKeyword('Productos')
.addAnswer('Si, dame un momento')

.addAction(async(ctx,{flowDynamic})=>{
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://desayunos-ricos-y-saludables.myshopify.com/admin/api/2023-10/products.json',
        headers: { 
          'X-Shopify-Access-Token': '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'
        }
    };
    const respuestas = await axios.request(config)
    const products = respuestas.data.products.map((item) => {
        return {
            body:item.title, 
            delay:950,
            media:item.image.src
        }
        
    })

await flowDynamic(products)

})

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowBienvenida, flowProducts])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
