const { Client, AttachmentBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const config = require('./config.json')
const client = new Client({
    intents: 3276799
})

client.on('ready', async () => {
    console.log('[RIO] Rio Movedora fazendo mais uma função!')
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return
    const attachments = []
    message.attachments.forEach(attachment => {
        let attach = new AttachmentBuilder(attachment.url)
        attachments.push(attach)
    })
    if (message.channel.id === config.elixir) {
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Confirmar')
                .setEmoji('✅')
                .setStyle('Success'),
            new ButtonBuilder()
                .setCustomId('delete')
                .setLabel('Não enviar')
                .setEmoji('❌')
                .setStyle('Danger'),
        );
        message.reply({
            content: 'Você deseja enviar esta mensagem para o canal de <#{{provas}}> do Elixir Lab?'.replace('{{provas}}', config.elixir),
            components: [row]
        })
    }
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isButton()) return
    if (interaction.customId === 'confirm') {
        const message = await interaction.message.fetchReference()
        const attachments = []
        message.attachments.forEach(attachment => {
            let attach = new AttachmentBuilder(attachment.url)
            attachments.push(attach)
        })
        const channel = await client.channels.cache.get(config.tribunal)
        return channel.send({
            content: message.content,
            files: attachments,
        }).then(() => {
            interaction.message.delete()
        })
    } else if (interaction.customId === 'delete') {
        return interaction.message.delete()
    }
})

client.login(config.token)