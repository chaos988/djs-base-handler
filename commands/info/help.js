const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "All the command names, description, aliases",
  aliases: ["h"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const directories = [
      ...new Set(client.commands.map((cmd) => cmd.directory)),
    ];

    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

    const categories = directories.map((dir) => {
      const getCommands = client.commands
        .filter((cmd) => cmd.directory === dir)
        .map((cmd) => {
          return {
            name: cmd.name || "No Command name",
            description:
              `${cmd.description}\nAliases: \`${cmd.aliases.join(", ")}\`` ||
              "No Command Description.",
          };
        });

      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });

    const initialEmbed = new MessageEmbed()
      .setTitle("HELP 📬")
      .setDescription("Select a category from the dropdown menu.")
      .setColor("RANDOM");

    const components = (state) => [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setPlaceholder("CHOOSE A CATEGORY")
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => {
              return {
                label: `${cmd.directory.toUpperCase()} COMMANDS`,
                value: cmd.directory.toLowerCase(),
                description: `${cmd.directory.toUpperCase()}`,
              };
            })
          )
      ),
    ];

    const initialMessage = await message.channel.send({
      embeds: [initialEmbed],
      components: components(false),
    });

    const filter = (interaction) => interaction.user.id === message.author.id;

    const collector = message.channel.createMessageComponentCollector({
      filter,
      componentType: "SELECT_MENU",
    });

    collector.on("collect", (interaction) => {
      const [directory] = interaction.values;
      const category = categories.find(
        (x) => x.directory.toLowerCase() === directory
      );

      const categoryEmbed = new MessageEmbed()
        .setTitle(`${directory} Commands`)
        .setColor("RANDOM")
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `\`${cmd.name}\``,
              value: cmd.description,
              inline: true,
            };
          })
        );

      interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on("end", () => {
      initialMessage.edit({ components: components(true) });
    });
  },
};
