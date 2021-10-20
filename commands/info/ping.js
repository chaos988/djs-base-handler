const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "",
  aliases: [""],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const msg = await message.reply({ content: "Pinging. . ." });

    let circles = {
      green: "🟢",
      yellow: "🟡",
      red: "🔴",
    };

    const messageEdit = Math.floor(msg.createdAt - message.createdAt);
    const botlatency = client.ws.ping;

    const pingEmbed = new MessageEmbed()
        .setTitle("PING")
        .addField("My Latency:", `${messageEdit <= 200 ? circles.green : messageEdit <= 400 ? circles.yellow : circles.red} \`${messageEdit.toLocaleString()}ms\``, true)
        .addField("Api Latency:", `${botlatency <= 200 ? circles.green : botlatency <= 400 ? circles.yellow : circles.red} \`${botlatency.toLocaleString()}ms\``, true)
        .setColor("RANDOM")
    message.channel.send({ embeds: [pingEmbed] })
  },
};
