require('dotenv')
const { Client,Util, Collection,MessageEmbed,Structures } = require("discord.js");
const client = new Client({
    disableEveryone: true
})
const keepAlive = require('./server.js')
keepAlive()
const config = require("./config.json")
const db = require("quick.db")

client.on('message', async (message, args) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  const filter = (m) => m.author.id === "869885944965263370";
  const donate = config.username
  if (message.content.replace(/ /g,'').toLowerCase().startsWith("e"+"donate") || message.content.replace(/ /g,'').toLowerCase().startsWith(config.owoprefix+"donate")) {
  let check = await db.get(message.author.id)
  if (check == null) db.set(message.author.id, 0)
  let owocash = await db.get(message.author.id)

  message.channel.awaitMessages(filter, {max:1,time: 5000,errors:["time"]}).then(async (collected) => {
    const user = message.guild.members.cache.get(message.author.id)
    const msg = collected.first().content
   console.log(msg)


  if(!msg.includes("💳")) return
    const str = msg
    .replace('**💳 | ','')
    .replace('** sent **','')
    .replace(' cowoncy** to **','')
    .replace(message.author.username,'')
    .replace(',','')
    const cash = parseInt(str) 
    owocash = owocash + cash
    console.log(owocash)
    await db.set(message.author.id, owocash)

  
   if(msg.includes(message.author.username) && msg.includes(donate) && owocash >= config.amount_requested) {
    const role1 = message.guild.roles.cache.find(r => r.id == config.role_id)
    const emoji1 = message.guild.emojis.cache.find(r => r.id == config.emoji_id)
    if(role1) {
      await user.roles.add(role1.id)
    }
    if(config.message_reply != "none" || config.message_reply != "" ) {
      await message.channel.send(config.message_reply
      .replace(/<author>/g,message.author)
      .replace(/<amount>/g,new Intl.NumberFormat('en-US').format(owocash))
      .replace(/<server>/g,message.guild.name))
    }
    if(emoji1) {
      await message.react(emoji1.id)
    }
   } 
  }).catch((e) => {console.log(e)})

}
});


client.on('ready', async () => {
    console.log(`${client.user.tag} is online!`)
})

client.login(process.env.TOKEN)
