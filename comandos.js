const fetch = require('node-fetch');

// Lista de nombres de las primeras 4 generaciones para no depender de llamadas lentas
const POKEMON_NOMBRES = [
    "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
    "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree",
    "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata",
    "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Clefairy", "Vulpix", "Ninetales",
    "Jigglypuff", "Zubat", "Oddish", "Meowth", "Psyduck", "Mankey", "Growlithe",
    "Poliwag", "Abra", "Machop", "Tentacool", "Geodude", "Ponyta", "Slowpoke",
    "Magnemite", "Doduo", "Seel", "Grimer", "Gastly", "Haunter", "Gengar", "Onix",
    "Drowzee", "Krabby", "Voltorb", "Exeggcute", "Cubone", "Koffing", "Rhyhorn",
    "Chansey", "Tangela", "Kangaskhan", "Horsea", "Goldeen", "Staryu", "Scyther",
    "Jynx", "Electabuzz", "Magmar", "Pinsir", "Tauros", "Magikarp", "Gyarados",
    "Lapras", "Ditto", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon",
    "Omanyte", "Kabuto", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres",
    "Dratini", "Dragonair", "Dragonite", "Mewtwo", "Mew", "Chikorita", "Cyndaquil",
    "Totodile", "Togepi", "Ampharos", "Marill", "Sudowoodo", "Espeon", "Umbreon",
    "Unown", "Wobbuffet", "Girafarig", "Scizor", "Heracross", "Sneasel", "Teddiursa",
    "Slugma", "Swinub", "Corsola", "Delibird", "Skarmory", "Houndour", "Kingdra",
    "Phanpy", "Donphan", "Porygon2", "Stantler", "Smeargle", "Tyrogue", "Hitmontop",
    "Smoochum", "Elekid", "Magby", "Miltank", "Blissey", "Raikou", "Entei", "Suicune",
    "Larvitar", "Pupitar", "Tyranitar", "Lugia", "Ho-Oh", "Celebi", "Treecko",
    "Torchic", "Mudkip", "Poochyena", "Zigzagoon", "Ralts", "Slakoth", "Whismur",
    "Makuhita", "Aron", "Meditite", "Electrike", "Carvanha", "Wailmer", "Numel",
    "Spoink", "Trapinch", "Cacnea", "Swablu", "Zangoose", "Seviper", "Feebas",
    "Milotic", "Castform", "Kecleon", "Shuppet", "Duskull", "Tropius", "Chimecho",
    "Absol", "Snorunt", "Spheal", "Relicanth", "Luvdisc", "Bagon", "Beldum",
    "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon",
    "Rayquaza", "Jirachi", "Deoxys", "Turtwig", "Chimchar", "Piplup", "Starly",
    "Bidoof", "Shinx", "Cranidos", "Shieldon", "Pachirisu", "Buizel", "Cherubi",
    "Shellos", "Drifloon", "Buneary", "Glameow", "Chingling", "Stunky", "Bronzor",
    "Bonsly", "Mime Jr.", "Happiny", "Chatot", "Spiritomb", "Gible", "Gabite",
    "Garchomp", "Munchlax", "Riolu", "Lucario", "Hippopotas", "Skorupi", "Croagunk",
    "Carnivine", "Finneon", "Mantyke", "Snover", "Weavile", "Magnezone", "Rhyperior",
    "Tangrowth", "Electivire", "Magmortar", "Togekiss", "Yanmega", "L Leafeon",
    "Glaceon", "Gliscor", "Mamoswine", "Porygon-Z", "Gallade", "Probopass", "Dusknoir",
    "Froslass", "Rotom", "Uxie", "Mesprit", "Azelf", "Dialga", "Palkia", "Heatran",
    "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus"
];

const comandos = {
    // REGISTRO
    '.registrar': async (args, usuario, remitente, usuariosBD) => {
        if (usuario) {
            return `⚠️ Ya estás registrado como *${usuario.nombre}*. ¡Usa *.menu* para ver tus comandos!`;
        }

        const nombreElegido = args.join(' ').trim();
        if (!nombreElegido) {
            return `❌ Debes especificar un nombre.\nEjemplo: *.registrar Red*`;
        }

        usuariosBD[remitente] = {
            nombre: nombreElegido,
            nivel: 1,
            monedas: 100,
            pokeballs: 10,
            pociones: 3,
            pokemon: []
        };

        return `🎉 ¡Felicidades *${nombreElegido}*! Te has registrado en **PokeBot**.\n\n` +
               `🎁 *Regalo:* 🔴 x10 Pokéballs | 🪙 $100 Monedas\n` +
               `💡 Escribe *.menu* para empezar.`;
    },

    // MENÚ
    '.': (args, usuario) => {
        return `🎮 *POKEBOT MENÚ* 🎮\n` +
               `👤 *Entrenador:* ${usuario.nombre}\n` +
               `━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
               `• *.mispokemon* - Ver tus Pokémon\n` +
               `• *.mochila* - Ver inventario\n` +
               `• *.perfil* - Ver perfil\n` +
               `• *.toppokemon* - Ranking\n` +
               `• *.capturar* - Atrapar Pokémon con foto\n` +
               `• *.tienda* - Comprar Pokéballs`;
    },
    '.menu': (args, usuario) => comandos['.'](args, usuario),
    '.menú': (args, usuario) => comandos['.'](args, usuario),

    // MIS POKEMON
    '.mispokemon': (args, usuario) => {
        if (usuario.pokemon.length === 0) {
            return `❌ Aún no tienes Pokémon. ¡Usa *.capturar*!`;
        }

        let texto = `🐾 *EQUIPO DE ${usuario.nombre.toUpperCase()}* 🐾\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        usuario.pokemon.forEach((p, index) => {
            texto += `*${index + 1}. ${p.nombre}* (#${p.id})\n🔹 Nivel: ${p.nivel} | HP: ${p.hp}\n\n`;
        });
        return texto;
    },

    // MOCHILA
    '.mochila': (args, usuario) => {
        return `🎒 *MOCHILA DE ${usuario.nombre.toUpperCase()}*\n\n🔴 Pokéballs: ${usuario.pokeballs}\n🧪 Pociones: ${usuario.pociones}`;
    },

    // PERFIL
    '.perfil': (args, usuario) => {
        return `👤 *ENTRENADOR:* ${usuario.nombre}\n⭐ *Nivel:* ${usuario.nivel}\n🪙 *Monedas:* $${usuario.monedas}\n🐾 *Pokémon:* ${usuario.pokemon.length}`;
    },

    // RANKING
    '.toppokemon': (args, usuario, remitente, usuariosBD) => {
        const todos = Object.values(usuariosBD);
        todos.sort((a, b) => b.pokemon.length - a.pokemon.length);

        let texto = `🏆 *TOP ENTRENADORES* 🏆\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        todos.slice(0, 5).forEach((u, i) => {
            const medalla = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '👤';
            texto += `${medalla} *${i + 1}. ${u.nombre}* - ${u.pokemon.length} Pokémon 🐾\n`;
        });
        return texto;
    },

    // CAPTURAR CON IMAGEN ULTRA RÁPIDA
    '.capturar': async (args, usuario) => {
        if (usuario.pokeballs <= 0) {
            return `❌ ¡No tienes Pokéballs! Compra más en la *.tienda*.`;
        }

        usuario.pokeballs--;

        // Número aleatorio del 1 al 250 (o hasta el total de la lista)
        const idAzar = Math.floor(Math.random() * POKEMON_NOMBRES.length) + 1;
        const nombrePkm = POKEMON_NOMBRES[idAzar - 1] || `Pokémon #${idAzar}`;
        
        // Sprite directo PNG en alta velocidad
        const urlImagen = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idAzar}.png`;

        const exito = Math.random() < 0.75;

        if (exito) {
            const nivel = Math.floor(Math.random() * 10) + 1;
            const hpMax = nivel * 5 + 15;

            usuario.pokemon.push({
                id: idAzar,
                nombre: nombrePkm,
                nivel: nivel,
                hp: `${hpMax}/${hpMax}`
            });

            usuario.monedas += 25;

            return {
                imagen: urlImagen,
                texto: `🌿 ¡Un *${nombrePkm}* (#${idAzar}) salvaje ha aparecido!\n` +
                       `🔴 ¡Lanzaste una Pokéball y lo atrapaste! 🎉\n\n` +
                       `✨ *${nombrePkm}* (Nivel ${nivel}) añadido a tu equipo.\n` +
                       `🪙 +$25 Monedas ganadas.\n` +
                       `🎒 Te quedan ${usuario.pokeballs} Pokéballs.`
            };
        } else {
            return {
                imagen: urlImagen,
                texto: `🌿 ¡Un *${nombrePkm}* (#${idAzar}) salvaje ha aparecido!\n` +
                       `💥 ¡Oh no! Se escapó de la Pokéball...\n` +
                       `🎒 Te quedan ${usuario.pokeballs} Pokéballs.`
            };
        }
    },

    // TIENDA
    '.tienda': (args, usuario) => {
        return `🏪 *TIENDA POKÉMON* 🏪\n` +
               `━━━━━━━━━━━━━━━━━━━━━━━\n` +
               `🪙 *Tus monedas:* $${usuario.monedas}\n\n` +
               `🔴 *Pokéball* - $50 Monedas\n` +
               `   ↳ Escribe *.comprar pokeball*`;
    },

    // COMPRAR
    '.comprar pokeball': (args, usuario) => {
        if (usuario.monedas < 50) {
            return `❌ Monedas insuficientes. Necesitas $50 y tienes $${usuario.monedas}.`;
        }

        usuario.monedas -= 50;
        usuario.pokeballs += 1;

        return `✅ ¡Compraste 1 🔴 Pokéball!\n` +
               `🎒 Tienes ${usuario.pokeballs} Pokéballs.\n` +
               `🪙 Monedas restantes: $${usuario.monedas}`;
    }
};

async function ejecutarComando(texto, remitente, usuariosBD) {
    const partes = texto.trim().split(' ');
    const comando = partes[0].toLowerCase();
    const args = partes.slice(1);

    const usuario = usuariosBD[remitente];

    if (comando === '.registrar') {
        return await comandos['.registrar'](args, usuario, remitente, usuariosBD);
    }

    if (!usuario && comando.startsWith('.')) {
        return `⚠️ *¡NO ESTÁS REGISTRADO!*\n\n👉 Registrarte escribiendo: *.registrar TuNombre*\n*Ejemplo:* .registrar Ash`;
    }

    if (comandos[comando]) {
        return await comandos[comando](args, usuario, remitente, usuariosBD);
    }

    return null;
}

module.exports = { ejecutarComando };