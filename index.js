require('dotenv')
const { Client,Util, Collection,MessageEmbed,Structures } = require("discord.js");
const client = new Client({
    disableEveryone: true
})
const config = require("./config.json")
const db = require("quick.db")

client.on('message', async (message, args) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  const filter = (m) => m.author.id === "408785106942164992";
  const donate = config.username
  if (message.content
  .replace(/ /g,'')
  .toLowerCase()
  .startsWith("owo"+"give") || 
  message.content.replace(/ /g,'')
  .toLowerCase()
  .startsWith(config.owoprefix+"give")) {
  let check = await db.get(message.author.id)
  if (check == null) db.set(message.author.id, 0)
  let owocash = await db.get(message.author.id)

  message.channel.awaitMessages(filter, {max:1,time: 5000,errors:["time"]}).then(async (collected) => {
    const user = message.guild.members.cache.get(message.author.id)
    const msg =  collected.first().content
   console.log(msg)

  if(!msg.includes("💳","高级骑士")) return
    const str = msg
    .replace('**💳 | ','')
    .replace('** sent **','')
    .replace(' cowoncy** to **','')
    .replace('**!','')
    .replace(message.author.username,'')
    .replace(donate,'')
    .replace(/,/g,'')

    const cash = parseInt(str)
    owocash = owocash + cash
    console.log(owocash)
    await db.set(message.author.id, owocash)
    // role donate 1
    let roledonate1 = 1000 - owocash
      
   if(msg.includes(message.author.username) && msg.includes(donate) && owocash <= 1000) {
    if(config.message_reply != "none" || config.message_reply != "" ) {
      const embeddonate1 = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`Cảm ơn bạn đã donate`)
      .setAuthor(`${user.username}`, message.author.avatarURL)
      .addField('Số tiền donate', `${cash}`, true)
      .addField('Role donate', `none`, true)
      .addField('Uprole', `${roledonate1}`, true)
      .setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

      return message.channel.send(embeddonate1)
    }

   }else if(msg.includes(message.author.username) && msg.includes(donate) && owocash >= 10000){
    const role1 = message.guild.roles.cache.find(r => r.id == config.role_id)
    const emoji1 = message.guild.emojis.cache.find(r => r.id == config.emoji_id)

    if(role1) {
      await user.roles.add(role1.id)
    }
    if(config.message_reply != "none" || config.message_reply != "" ) {
      const embeddonate2 = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`Cảm ơn bạn đã donate`)
      .setAuthor(`${user.username}`, message.author.avatarURL)
      .addField('Số tiền donate', `${cash}`, true)
      .addField('Role donate', `<@&875551527857705050>`, true)
      .addField('Uprole', `Bạn đã max role`, true)
      .setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

      return message.channel.send(embeddonate2)
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

client.login('ODY5ODg1OTQ0OTY1MjYzMzcw.YQEuag._9ZiTqXpmlOJGmyHwcFT1CfSEF4')
