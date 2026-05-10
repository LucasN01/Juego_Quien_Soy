// =============================================
// =========== DATOS DEL JUEGO =================
// =============================================

const CATEGORIES = {
  "Personajes Disney": {
    icon: "🏰",
    color: "#a78bfa",
    // 84 personajes — los más icónicos, conocidos por todas las generaciones en Argentina
    words: [
      // Clásicos de siempre
      "Mickey Mouse", "Minnie Mouse", "Donald Duck", "Goofy", "Pluto",
      "Pato Donald", "Chip y Dale", "El Pato Lucas", "Bugs Bunny", "Tweety",
      // El Rey León
      "Simba", "Mufasa", "Nala", "Timón", "Pumba", "Scar",
      // La Sirenita
      "Ariel", "Úrsula", "Sebastián", "Flounder", "El Príncipe Eric",
      // Blancanieves / Cenicienta / Bella Durmiente
      "Blancanieves", "La Madrastra Malvada", "Cenicienta", "El Hada Madrina", "La Bella Durmiente", "Maléfica",
      // La Bella y la Bestia
      "Bella", "La Bestia", "Gastón", "Lumière", "Ding Dong",
      // Aladdín
      "Aladdín", "Jasmine", "Jafar", "El Genio", "Iago",
      // Toy Story
      "Woody", "Buzz Lightyear", "Jessie", "Rex", "Hamm", "El Señor Cara de Papa",
      // Frozen
      "Elsa", "Anna", "Olaf", "Kristoff", "Hans",
      // Buscando a Nemo
      "Nemo", "Dory", "Marlin", "El Tiburón Bruceico",
      // Pixar varios
      "Remy", "WALL-E", "Rayo McQueen", "Mater", "Edna Moda", "Mr. Increíble",
      // Encanto
      "Mirabel", "Luisa", "Isabela", "Bruno",
      // Otros clásicos reconocibles
      "Hércules", "Megara", "Hades",
      "Mulan", "Moana", "Maui",
      "Tiana", "Pocahontas",
      "Stitch", "Lilo",
      "Bambi", "Dumbo", "Pinocho", "Jiminy Cricket",
      "Mowgli", "Baloo", "Shere Khan",
      "Jack Skellington", "Capitán Garfio", "Campanita",
      "Mérida", "Rapunzel"
    ]
  },

  "Superhéroes": {
    icon: "🦸",
    color: "#f59e0b",
    // 68 personajes — Marvel y DC, los más vistos en Argentina (cine + TV + comics)
    words: [
      // Avengers core
      "Spider-Man", "Iron Man", "Capitán América", "Thor", "Hulk",
      "Viuda Negra", "Ojo de Halcón", "Ant-Man", "Doctor Strange", "Pantera Negra",
      "Bruja Escarlata", "Visión", "Falcon", "War Machine",
      // Guardianes / Otros Marvel
      "Deadpool", "Wolverine", "Pantera Negra", "Star-Lord", "Gamora", "Drax",
      "Groot", "Rocket Raccoon", "Thanos", "Loki", "Hela",
      // X-Men
      "Cíclope", "Jean Grey", "Tormenta", "Bestia", "Magneto", "Profesor X", "Mística",
      // Villanos Marvel
      "Venom", "El Duende Verde", "Doctor Octopus", "Electro", "Ultron", "Dormammu", "Red Skull",
      // DC Trinity y compañía
      "Superman", "Batman", "Wonder Woman", "Flash", "Linterna Verde",
      "Aquaman", "Shazam", "Cyborg", "Supergirl", "Nightwing",
      // Villanos DC
      "El Joker", "Lex Luthor", "Harley Quinn", "El Pingüino", "Catwoman",
      "Bane", "El Acertijo", "Doomsday",
      // Series/animadas muy conocidas en Argentina
      "Robin", "Raven", "Starfire",
      // Kang, Silver Surfer (pelis recientes muy vistas)
      "Kang el Conquistador", "Silver Surfer", "Galactus", "Hulka", "Thor Jane Foster", "Captain Marvel", "Nick Furia", "Spider-Man Miles Morales"
    ]
  },

  "Animé": {
    icon: "⛩️",
    color: "#f97316",
    // 82 personajes — los animes más populares en Argentina
    words: [
      // Dragon Ball (enorme en Argentina, pasó por Telefé)
      "Goku", "Vegeta", "Piccolo", "Gohan", "Krilin", "Bulma", "Freezer", "Cell", "Majin Buu",
      "Trunks", "Androide 18", "Broly", "Bardock",
      // Naruto (muy popular)
      "Naruto", "Sasuke", "Sakura", "Kakashi", "Itachi", "Gaara", "Jiraiya", "Hinata", "Obito",
      // One Piece
      "Luffy", "Zoro", "Nami", "Usopp", "Sanji", "Chopper", "Robin", "Shanks", "Barba Blanca",
      "Portgas D. Ace", "Doflamingo", "Boa Hancock",
      // Demon Slayer (Kimetsu no Yaiba)
      "Tanjiro Kamado", "Nezuko Kamado", "Zenitsu", "Inosuke", "Giyu Tomioka", "Muzan Kibutsuji",
      // My Hero Academia
      "Deku", "Bakugo", "Todoroki", "All Might", "Uraraka", "Endeavor", "Dabi",
      // Attack on Titan
      "Eren Yeager", "Mikasa Ackerman", "Armin Arlert", "Levi Ackerman",
      // Fullmetal Alchemist
      "Edward Elric", "Alphonse Elric", "Roy Mustang",
      // Death Note
      "Light Yagami", "L Lawliet", "Ryuk", "Misa Amane",
      // Pokémon (anime)
      "Ash Ketchum", "Misty", "Brock", "El Team Rocket", "Jessie y James",
      // Sailor Moon (pasó por TV argentina)
      "Sailor Moon", "Sailor Mars", "Tuxedo Mask",
      // Dragon Ball clásico/GT personajes extra
      "Androide 17", "Vegetto", "Gogeta",
      // Sword Art Online / otros populares recientes
      "Kirito", "Asuna",
      // Shingeki / AOT extra
      "Historia Reiss", "Erwin Smith",
      // Captain Tsubasa (Oliver y Benji, muy conocido en Argentina)
      "Oliver Atom", "Benji Price", "Mark Lenders", "Doraemon",
      // Saint Seiya (Caballeros del Zodiaco, muy popular en Argentina)
      "Seiya de Pegaso", "Shiryu del Dragón", "Hyoga del Cisne", "Shun de Andrómeda", "Ikki del Fénix"
    ]
  },

  "Videojuegos": {
    icon: "🎮",
    color: "#10b981",
    // 70 personajes — los más conocidos en Argentina (consolas + PC)
    words: [
      // Nintendo (muy masivos)
      "Mario", "Luigi", "Princesa Peach", "Bowser", "Yoshi", "Wario", "Toad", "Donkey Kong",
      "Link", "Zelda", "Ganondorf",
      "Pikachu", "Charizard", "Mewtwo", "Snorlax", "Eevee", "Lucario",
      // Sega
      "Sonic el Erizo", "Tails", "Knuckles", "Shadow", "Amy Rose", "Dr. Eggman",
      // PlayStation exclusivos (muy jugados en Argentina)
      "Kratos", "Atreus", "Nathan Drake", "Joel", "Ellie", "Aloy",
      "Lara Croft", "Crash Bandicoot", "Spyro",
      // Final Fantasy (muy popular)
      "Cloud Strife", "Sephiroth", "Tifa Lockhart", "Aerith",
      // Otros muy jugados en Argentina
      "Master Chief", "Geralt de Rivia", "Ciri",
      "Solid Snake", "Raiden",
      "Ezio Auditore", "Altaïr",
      "Arthur Morgan", "John Marston",
      "GTA San Andreas - CJ", "GTA V - Trevor", "GTA V - Michael",
      "Mega Man", "Pac-Man",
      // FIFA / fútbol (el deporte más jugado en Argentina, FIFA es enorme)
      "Messi en FIFA", "Mbappé en FIFA",
      // Fortnite / Among Us (muy populares en Argentina en los últimos años)
      "El Fantasma de Fortnite", "El Impostor de Among Us",
      // Mortal Kombat / Street Fighter (arcade, muy conocidos)
      "Scorpion", "Sub-Zero", "Ryu", "Ken", "Chun-Li",
      // Minecraft (masivo)
      "Steve de Minecraft", "Creeper",
      // Free Fire / Minecraft / Roblox (generación joven Argentina)
      "El Personaje de Roblox", "Samus Aran", "Kirby", "Inkling de Splatoon", "Link (Zelda)", "Bowser Jr.", "Waluigi", "Diddy Kong", "Peach (Mario)"
    ]
  },

  "Famosos Mundiales": {
    icon: "🌍",
    color: "#06b6d4",
    // 58 personas — muy conocidas en Argentina por deporte, música o cine
    words: [
      // Fútbol mundial (el deporte rey en Argentina)
      "Lionel Messi", "Cristiano Ronaldo", "Neymar", "Kylian Mbappé", "Erling Haaland",
      "Pelé", "Ronaldinho", "Zinedine Zidane", "David Beckham",
      // Básquet
      "Michael Jordan", "LeBron James", "Kobe Bryant", "Stephen Curry", "Shaquille O'Neal",
      // Tenis
      "Roger Federer", "Rafael Nadal", "Novak Djokovic", "Serena Williams",
      // Atletismo / boxeo
      "Usain Bolt", "Michael Phelps", "Muhammad Ali", "Mike Tyson", "Floyd Mayweather",
      // Música pop/rock (muy conocidos en Argentina)
      "Taylor Swift", "Beyoncé", "Rihanna", "Lady Gaga", "Adele",
      "Bad Bunny", "Drake", "Eminem", "Michael Jackson", "Madonna",
      "Elvis Presley", "Freddie Mercury", "The Beatles", "David Bowie",
      "Shakira", "Jennifer Lopez", "Justin Bieber", "Ariana Grande",
      // Cine / TV
      "Leonardo DiCaprio", "Brad Pitt", "Tom Cruise", "Johnny Depp", "Meryl Streep",
      "Angelina Jolie", "Scarlett Johansson", "Keanu Reeves", "Ryan Gosling",
      // Tech / negocios (muy mediáticos)
      "Elon Musk", "Bill Gates", "Mark Zuckerberg", "Steve Jobs",
      // Política / figuras globales reconocidas
      "Barack Obama", "Donald Trump",
      // Redes / celebridades
      "Selena Gomez", "Oprah Winfrey"
    ]
  },

  "Famosos Argentinos": {
    icon: "🇦🇷",
    color: "#3b82f6",
    // 54 personas — mezcla de deportistas, músicos, actores, políticos, streamers y cantantes jóvenes
    words: [
      // Fútbol (los más famosos)
      "Diego Maradona", "Lionel Messi", "Gabriel Batistuta", "Juan Román Riquelme",
      "Carlos Tevez", "Sergio Agüero", "Ángel Di María", "Javier Zanetti",
      // Automovilismo
      "Franco Colapinto",
      // Básquet / tenis
      "Emanuel Ginóbili", "Juan Martín del Potro",
      // Música rock/pop clásica
      "Charly García", "Gustavo Cerati", "Fito Páez", "Luis Alberto Spinetta",
      "Andrés Calamaro", "La Mona Jiménez", "Rodrigo Bueno", "Los Redondos",
      // Cantantes y artistas jóvenes / urbanos (muy conocidos hoy)
      "Lali Espósito", "Tini Stoessel", "Nicki Nicole", "Duki",
      "Bizarrap", "María Becerra", "Trueno", "WOS", "Paulo Londra",
      "L-Gante",
      // Streamers y youtubers argentinos famosos
      "Coscu", "Spreen", "Luquitas Rodríguez", "Martín Cirio (La Faraona)",
      
      // TV / conductores / humoristas muy conocidos
      "Marcelo Tinelli", "Susana Giménez", "Mirtha Legrand",
      "Ricardo Darín", "Guillermo Francella", "Florencia Peña",
      "Darío Barassi", "Santiago del Moro", "Guido Kaczka",
      // Modelos / mediáticos
      "Pampita", "Wanda Nara",
      // Política (los más conocidos, todos los conocen aunque no sean fans)
      "Javier Milei", "Cristina Kirchner", "Mauricio Macri", "Sergio Massa",
      "Alberto Fernández", "Patricia Bullrich",
      // Históricos ineludibles
      "Eva Perón", "Juan Domingo Perón", "José de San Martín", "Manuel Belgrano"
    ]
  },

  "Personajes de TV": {
    icon: "📺",
    color: "#ec4899",
    // 60 personajes — series y programas MUY vistos en Argentina (Netflix + cable + aire)
    words: [
      // Breaking Bad / Better Call Saul (enormes en Argentina)
      "Walter White", "Jesse Pinkman", "Saul Goodman", "Mike Ehrmantraut",
      // Game of Thrones
      "Jon Snow", "Daenerys Targaryen", "Tyrion Lannister", "Cersei Lannister",
      "Arya Stark", "Sansa Stark", "El Rey de la Noche",
      // The Walking Dead
      "Rick Grimes", "Daryl Dixon", "Negan",
      // The Big Bang Theory (muy visto en Argentina por cable)
      "Sheldon Cooper", "Leonard Hofstadter", "Penny", "Howard Wolowitz", "Raj Koothrappali",
      // Friends (clásico en Argentina, pasó por Warner)
      "Ross Geller", "Rachel Green", "Monica Geller", "Chandler Bing", "Joey Tribbiani", "Phoebe Buffay",
      // Los Simpsons (icónico en Argentina, pasó por Fox)
      "Homer Simpson", "Marge Simpson", "Bart Simpson", "Lisa Simpson", "Ned Flanders", "El Señor Burns",
      // South Park
      "Cartman", "Kenny McCormick", "Stan Marsh", "Kyle Broflovski",
      // Stranger Things (muy popular en Netflix Argentina)
      "Eleven", "Mike Wheeler", "Dustin Henderson", "Lucas Sinclair", "El Demogorgon",
      // La Casa de Papel (enorme en Argentina)
      "El Profesor", "Berlín", "Nairobi", "Tokio", "Denver",
      // Narcos (muy visto)
      "Pablo Escobar",
      // The Office
      "Michael Scott", "Dwight Schrute", "Jim Halpert",
      // Series recientes muy vistas en Argentina
      "El Mandaloriano", "Grogu (Baby Yoda)",
      "Wednesday Addams", "Ted Lasso",
      // Peaky Blinders
      "Tommy Shelby",
      // Succession / Squid Game (muy populares)
      "Seokgi de El Juego del Calamar",
      // Animadas para adultos muy vistas
      "Bob Esponja", "Patrick Estrella", "Calamardo Tentáculos",
      // Programas argentinos icónicos
      "El Chavo del 8", "El Chapulín Colorado"
    ]
  },

  "Históricos y Mitológicos": {
    icon: "⚔️",
    color: "#ef4444",
    // 58 personajes — historia y mitología que se enseña en colegios argentinos
    words: [
      // Historia universal (currículum escolar argentino)
      "Alejandro Magno", "Julio César", "Cleopatra", "Napoleón Bonaparte",
      "Adolf Hitler", "Winston Churchill", "Abraham Lincoln", "George Washington",
      "Leonardo da Vinci", "Galileo Galilei", "Isaac Newton", "Albert Einstein",
      "Marie Curie", "Charles Darwin", "Sigmund Freud", "Karl Marx", "Nikola Tesla",
      "Thomas Edison", "Cristóbal Colón", "Marco Polo",
      "Genghis Khan", "Atila el Huno", "Vlad el Empalador", "Juana de Arco",
      // Personajes legendarios muy conocidos
      "El Rey Arturo", "Robin Hood", "Guillermo Tell",
      // Mitología griega (se enseña en el colegio)
      "Zeus", "Poseidón", "Hades", "Atenea", "Apolo", "Artemisa",
      "Ares", "Hermes", "Hera", "Afrodita",
      "Hércules", "Aquiles", "Odiseo", "Paris de Troya",
      "Perseo", "Teseo", "Medusa", "El Minotauro",
      // Mitología egipcia (también en el colegio)
      "Ra", "Osiris", "Isis", "Anubis", "Horus",
      // Mitología nórdica (muy popularizada por Marvel y videojuegos)
      "Thor (mitología)", "Odín", "Loki (mitología)", "Freya",
      // Figuras religiosas reconocidas globalmente
      "Jesús de Nazaret", "Moisés",
      // Historia argentina (currículum escolar)
      "San Martín", "Belgrano"
    ]
  },
};

// Paleta de colores para avatares en lobby
const AVATAR_COLORS = [
  '#f97316', '#a78bfa', '#10b981', '#f59e0b',
  '#06b6d4', '#ec4899', '#3b82f6', '#ef4444',
  '#84cc16', '#8b5cf6'
];
