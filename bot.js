const { Telegraf } = require('telegraf')
const config = require('config')
const token = config.get('token')
const mongoSecretKey = config.get('mongoDBSecretKey')
const bot = new Telegraf(token)
const mongoose = require('mongoose')
const User = require('./models/Users')

async function start(){
    mongoose.connect(mongoSecretKey, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log('DB connected')
        bot.launch()
    })
    .then(()=>{
        console.log('TG bot launched')
    })
}

mongoose.connect(mongoSecretKey, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

bot.on('message', (ctx)=>{
    if(ctx.message.text == 'дядя женя'){
        ctx.reply('Да, это я!')
    }
})

bot.start(async (ctx)=>{
    const userData = await User.findOne({userID: ctx.message.from.id})
    if(userData){
        console.log('123')
    } else {
        const newUser = new User({
            userID: ctx.message.from.id
        })
        newUser.save()
    }
})

bot.command('drink', async (ctx)=>{

    const DrinkData = await User.findOne({userID: ctx.message.from.id})
    if(!DrinkData){
        return 0
    }
    const isUserCanDrink = (data) =>{
        const {drinkedLastTime} = data
        const allowedTimeToDrink = Date.parse(drinkedLastTime) + 1000 * 60 * 60
        return allowedTimeToDrink < Date.now() ? true : false
    }

    if(isUserCanDrink(DrinkData)){
        User.updateOne({userID: ctx.message.from.id}, {$set:{
            totalyDrinked: DrinkData.totalyDrinked + 1,
            drinkedLastTime: Date.now()
        }})
        .then(()=>{
            ctx.reply(`Ты успешно выпил воды.\n Всего ты выпил ${DrinkData.totalyDrinked + 1} литров воды.\nВ следующий раз ты сможешь попить только через час.`)
        })
    } else{
        const timeUntillNewDrink = Date.parse(DrinkData.drinkedLastTime) + 1000 * 60 * 60
        ctx.reply(`Ты не можешь пить водичку ещё ${Math.ceil( ( timeUntillNewDrink - Date.now() ) / 1000 / 60 )} минут`)
    }
})

bot.on('left_chat_member', (ctx)=>{
    ctx.reply('123')
    console.log('123')
})

bot.help((ctx)=>{
    ctx.reply('Привет. Если тебе нужно связаться с разработчиком - пиши @hello_worldddd!')
})



start()