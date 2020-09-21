const Discord = require('discord.js')
const client = new Discord.Client()
const config =  require('./config.json')
const fs = require('fs');
const { disconnect } = require('process');
const ytdl = require('ytdl-core-discord');
const { OpusEncoder } = require('@discordjs/opus')
const fetch = require('node-fetch');
const querystring = require('querystring');
const { split } = require('ffmpeg-static');
const YouTube = require("discord-youtube-api");
const { getVideoID } = require('ytdl-core-discord');
 
const youtube = new YouTube("AIzaSyC5Zm2cKau9R8i-yUUi-slhqxv_WkOWJRI");

client.on('ready',()=>{
    console.log('Connected as' + client.user.tag)

    client.user.setActivity('Javascript')

    client.guilds.cache.forEach((guild) => {
        console.log(guild.name)
        guild.channels.cache.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })        
        // General id: 445045705103638552

    })
/*    let generalChannel = client.channels.cache.get('753961875313787030')
    let VoiceChannel = client.channels.cache.get('445045705103638552')
*/
    // generalChannel.send('Msj de prueba', {files: ['./hidepainpepe.jpg'] });

})
  
 

client.on('message', async (receivedMessage)=>{
    if (receivedMessage.author == client.user){
        return
    }
    if (!receivedMessage.guild) return;
   

    if(receivedMessage.content.startsWith('!')){
        processCommand(receivedMessage)
    }
})
let voiceChannel 
let connection
let dispatcher
let stream




async function processCommand(receivedMessage){
    let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(' ')
    let primaryCommand = splitCommand[0]
    let query = receivedMessage.content.substr(8)
    switch (primaryCommand){
    case 'play' : 
        let url =[splitCommand[1]].toString().trim()
        console.log(url)
        let isValid = ytdl.validateURL(url)
        if(!isValid){
            receivedMessage.channel.send('Tema invalido ' + receivedMessage.author.toString() )
        } else{
            receivedMessage.react('▶')
            voiceChannel = receivedMessage.member.voice.channel
            connection = await voiceChannel.join();
            stream = ytdl(url);
            let msj = receivedMessage.channel.send('Reproduciendo tema pedido por ' + receivedMessage.author.toString() )
            playstream();
            
                }
            break; 

    case 'stop':
        connection.dispatcher.end();
        receivedMessage.react('⏹')
        break;

    case 'date':
        receivedMessage.react('⌚')
        let today = new Date();
        today = today.toDateString();
        let hora = new Date
        hora = hora.toTimeString();
        receivedMessage.channel.send('Hola ' + receivedMessage.author.toString()+', el dia es: ' + today + 'y la hora es ' + hora)
        break;

    case 'dawn': 
        receivedMessage.channel.send('Hola dadaaaawn '+receivedMessage.author.toString() )
        break;
    

    case 'help':
        receivedMessage.channel.send(
            '!play para reproducir una cancion\n!search para buscar una cancion en youtube\n!stop para parar\n!date para obtener fecha y hora actual')
            break;
    case 'search':
            search()
             break;
        
}
    if (!receivedMessage.member.voice.channel){
        receivedMessage.reply('Tenes que estar en un canal de voz primero!')
    }


    async function search() {

        query
        console.log(query)
        let vidresult = await youtube.searchVideos(`'${query}'`)
        url = (`https://www.youtube.com/watch?v=${(vidresult['id'])}`)
        console.log(vidresult['title'])
        receivedMessage.channel.send(url)
        receivedMessage.channel.send('Reproduciendo: '+ (vidresult['title']) + ' pedido por:'+ receivedMessage.author.toString() )
        playsearch()
    } 
    async function playsearch(){
        await url
        voiceChannel = receivedMessage.member.voice.channel
        connection = await voiceChannel.join() 
        stream = ytdl((url), { filter:'audioonly'}) 
        playstream()
    }
        
        async function playstream(){
            
        dispatcher = connection.play(await stream, { type: 'opus', quality: [360], highWaterMark: 1<<20}, {highWaterMark: 1024 * 1024 * 10});
        receivedMessage.delete()
        }
  
        
}




client.login(config.token)




