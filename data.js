// =============================================
// =========== DATOS DEL JUEGO =================
// =============================================

const CATEGORIES = {
  "Personajes Disney": {
    icon: "🏰",
    color: "#a78bfa",
    words: ["Mickey Mouse", "Minnie Mouse", "Donald Duck", "Goofy", "Pluto", "Simba", "Mufasa", "Nala", "Timon", "Pumba", "Ariel", "Ursula", "Sebastián", "Flounder", "Blancanieves", "La Bruja", "Cenicienta", "El Príncipe Azul", "La Bella Durmiente", "Malefica", "Bella", "La Bestia", "Gastón", "Lumiere", "Cogsworth", "Aladdín", "Jasmine", "Yago", "Jafar", "Genio", "Hércules", "Megara", "Hades", "Woody", "Buzz Lightyear", "Jessie", "Rex", "Hamm", "Nemo", "Dory", "Marlin", "El Crush", "Merida", "Moana", "Maui", "Tamatoa", "Rayo McQueen", "Mater", "WALL-E", "EVE", "Remy", "Linguini", "Elsa", "Anna", "Olaf", "Kristoff", "Sven", "Hans", "Ralph", "Vanellope", "Jack Skellington", "Sally", "Stitch", "Lilo", "Capitán Gancho", "Campanita", "Buscando a Nemo", "Bambi", "Dumbo", "Pinocho", "Mowgli", "Baloo", "Shere Khan", "La sirenita", "Mulan", "Pocahontas", "Tiana", "Mirabel", "Luisa", "Bruno", "Camilo", "Isabela"]
  },
  "Superhéroes": {
    icon: "🦸",
    color: "#f59e0b",
    words: ["Spider-Man", "Iron Man", "Capitán América", "Thor", "Hulk", "Black Widow", "Ojo de Halcón", "Ant-Man", "Doctor Strange", "Pantera Negra", "Scarlet Witch", "Visión", "Falcon", "Bucky Barnes", "Deadpool", "Wolverine", "Cíclope", "Jean Grey", "Tormenta", "Bestia", "Gambit", "Rogue", "Magneto", "El Profesor X", "Mystique", "Superman", "Batman", "Wonder Woman", "Flash", "Linterna Verde", "Aquaman", "Shazam", "Cyborg", "Robin", "Joker", "Lex Luthor", "Harley Quinn", "The Penguin", "Catwoman", "Bane", "Riddler", "Green Arrow", "Black Canary", "Supergirl", "Nightwing", "Starfire", "Raven", "Cyborg", "El Hombre de Acero", "Thanos", "Loki", "Venom", "Carnage", "El Duende Verde", "Doctor Octopus", "Sandman", "Electro", "Rhino", "Mysterio", "Vulture", "Silver Surfer", "Galactus", "Ultron", "Dormammu", "Red Skull", "Zemo", "Hela", "Ronan", "Kang el Conquistador"]
  },
  "Animé": {
    icon: "⛩️",
    color: "#f97316",
    words: ["Goku", "Vegeta", "Piccolo", "Gohan", "Trunks", "Krilin", "Bulma", "Freezer", "Cell", "Majin Buu", "Naruto", "Sasuke", "Sakura", "Kakashi", "Obito", "Madara", "Itachi", "Gaara", "Jiraiya", "Tsunade", "Luffy", "Zoro", "Nami", "Usopp", "Sanji", "Chopper", "Robin", "Franky", "Brook", "Shanks", "Barba Blanca", "Portgas D. Ace", "Doflamingo", "Kaido", "Big Mom", "Ichigo Kurosaki", "Rukia Kuchiki", "Byakuya Kuchiki", "Renji Abarai", "Sosuke Aizen", "Edward Elric", "Alphonse Elric", "Roy Mustang", "Winry Rockbell", "Scar", "Eren Yeager", "Mikasa Ackerman", "Armin Arlert", "Levi Ackerman", "Historia Reiss", "Tanjiro Kamado", "Nezuko Kamado", "Zenitsu Agatsuma", "Inosuke Hashibira", "Giyu Tomioka", "Muzan Kibutsuji", "Deku", "Bakugo", "Todoroki", "All Might", "Uraraka", "Endeavor", "Dabi", "Tomura Shigaraki", "Light Yagami", "L Lawliet", "Near", "Misa Amane", "Ryuk", "Sailor Moon", "Sailor Mars", "Sailor Jupiter", "Sailor Venus", "Tuxedo Mask", "Inuyasha", "Kagome", "Sango", "Miroku", "Sesshomaru", "Gintoki Sakata", "Lelouch Lamperouge", "Zero"]
  },
  "Videojuegos": {
    icon: "🎮",
    color: "#10b981",
    words: ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Wario", "Waluigi", "Toad", "Donkey Kong", "Link", "Zelda", "Ganondorf", "Navi", "Epona", "Pikachu", "Charizard", "Mewtwo", "Snorlax", "Jigglypuff", "Eevee", "Sonic el Erizo", "Tails", "Knuckles", "Shadow", "Amy Rose", "Dr. Eggman", "Mega Man", "Pac-Man", "Donkey Kong", "Master Chief", "Cortana", "Marcus Fenix", "Kratos", "Atreus", "Nathan Drake", "Lara Croft", "Ezio Auditore", "Altair", "Cloud Strife", "Sephiroth", "Tifa Lockhart", "Aerith", "Squall Leonhart", "Lightning", "Tidus", "Yuna", "Crash Bandicoot", "Spyro", "Ratchet", "Clank", "Jak", "Daxter", "Sly Cooper", "Solid Snake", "Raiden", "Geralt de Rivia", "Ciri", "Triss", "Arthur Morgan", "John Marston", "GTA San Andreas - CJ", "GTA V - Trevor", "Joel", "Ellie", "Aloy", "Scorpion", "Sub-Zero", "Ryu", "Ken", "Chun-Li", "Samus Aran"]
  },
  "Famosos Mundiales": {
    icon: "🌍",
    color: "#06b6d4",
    words: ["Lionel Messi", "Cristiano Ronaldo", "Neymar", "Kylian Mbappé", "Erling Haaland", "Michael Jordan", "LeBron James", "Kobe Bryant", "Stephen Curry", "Shaquille O'Neal", "Roger Federer", "Rafael Nadal", "Novak Djokovic", "Serena Williams", "Maria Sharapova", "Usain Bolt", "Michael Phelps", "Muhammad Ali", "Mike Tyson", "Floyd Mayweather", "Taylor Swift", "Beyoncé", "Rihanna", "Lady Gaga", "Adele", "Bad Bunny", "Drake", "Eminem", "Michael Jackson", "Madonna", "Elvis Presley", "The Beatles", "Freddie Mercury", "David Bowie", "Prince", "Leonardo DiCaprio", "Brad Pitt", "Tom Cruise", "Johnny Depp", "Meryl Streep", "Angelina Jolie", "Scarlett Johansson", "Margot Robbie", "Ryan Gosling", "Keanu Reeves", "Elon Musk", "Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Jeff Bezos", "Barack Obama", "Donald Trump", "Kim Kardashian", "Kylie Jenner", "Selena Gomez", "Ariana Grande", "Justin Bieber", "Shakira", "Jennifer Lopez", "Oprah Winfrey"]
  },
  "Famosos Argentinos": {
    icon: "🇦🇷",
    color: "#3b82f6",
    words: ["Diego Maradona", "Lionel Messi", "Gabriel Batistuta", "Juan Román Riquelme", "Carlos Tevez", "Sergio Agüero", "Ángel Di María", "Javier Zanetti", "Franco Colapinto", "Emanuel Ginóbili", "Juan Martín del Potro", "Guillermo Vilas", "Marcos Maidana", "Charly García", "Gustavo Cerati", "Fito Páez", "Luis Alberto Spinetta", "Andrés Calamaro", "La Mona Jiménez", "Rodrigo Bueno", "Lali Espósito", "Tini Stoessel", "Nicki Nicole", "Duki", "Bizarrap", "María Becerra", "Trueno", "WOS", "Marcelo Tinelli", "Susana Giménez", "Mirtha Legrand", "Ricardo Darín", "Guillermo Francella", "Florencia Peña", "Pampita", "Wanda Nara", "Jorge Rial", "Ángel de Brito", "Guido Kaczka", "Darío Barassi", "Santiago del Moro", "Javier Milei", "Cristina Kirchner", "Mauricio Macri", "Eva Perón", "José de San Martín", "Manuel Belgrano", "Coscu", "Spreen", "Luquitas Rodríguez", "Martin Cirio", "Vicky Xipolitakis", "Alex Caniggia", "Charlotte Caniggia", "Ricardo Fort"]
  },
  "Personajes de TV": {
    icon: "📺",
    color: "#ec4899",
    words: ["Walter White", "Jesse Pinkman", "Saul Goodman", "Mike Ehrmantraut", "Jon Snow", "Daenerys Targaryen", "Tyrion Lannister", "Cersei Lannister", "Arya Stark", "Sansa Stark", "Rick Grimes", "Daryl Dixon", "Negan", "Sheldon Cooper", "Leonard Hofstadter", "Penny", "Raj Koothrappali", "Howard Wolowitz", "Ross Geller", "Rachel Green", "Monica Geller", "Chandler Bing", "Joey Tribbiani", "Phoebe Buffay", "Michael Scott", "Dwight Schrute", "Jim Halpert", "Pam Beesly", "El Detective Pikachu", "Homer Simpson", "Marge Simpson", "Bart Simpson", "Lisa Simpson", "Eric Cartman", "Kyle Broflovski", "Stan Marsh", "Kenny McCormick", "Frank Underwood", "Claire Underwood", "Eleven", "Mike Wheeler", "Dustin Henderson", "Lucas Sinclair", "Will Byers", "Geralt de Rivia (serie)", "Yennefer", "Triss (serie)", "Tony Soprano", "Dexter Morgan", "Patrick Jane", "Gregory House", "Robin Hood", "El Mandalorian", "Grogu", "Ted Lasso", "Peaky Blinder - Tommy Shelby", "Pablo Escobar (Narcos)", "El Profesor (La Casa de Papel)", "Berlín", "Nairobi", "Tokyo"]
  },
  "Históricos y Mitológicos": {
    icon: "⚔️",
    color: "#ef4444",
    words: ["Alejandro Magno", "Julio César", "Cleopatra", "Napoleón Bonaparte", "Adolf Hitler", "Winston Churchill", "Abraham Lincoln", "George Washington", "Leonardo da Vinci", "Galileo Galilei", "Isaac Newton", "Albert Einstein", "Marie Curie", "Charles Darwin", "Sigmund Freud", "Karl Marx", "Nikola Tesla", "Thomas Edison", "Benjamin Franklin", "Cristóbal Colón", "Marco Polo", "Genghis Khan", "Atila", "Vlad el Empalador", "Juana de Arco", "El Rey Arturo", "Robin Hood", "Guillermo Tell", "Zeus", "Poseidón", "Hades", "Atenea", "Apolo", "Artemisa", "Ares", "Hermes", "Hera", "Afrodita", "Hércules", "Aquiles", "Odiseo", "Paris de Troya", "Hefesto", "Dionisio", "Perseo", "Teseo", "Medusa", "El Minotauro", "Ra", "Osiris", "Isis", "Anubis", "Horus", "Thor (mitología)", "Odín", "Loki (mitología)", "Freya", "Poseidón", "Atlas"]
  },
};

// Paleta de colores para avatares en lobby
const AVATAR_COLORS = [
  '#f97316', '#a78bfa', '#10b981', '#f59e0b',
  '#06b6d4', '#ec4899', '#3b82f6', '#ef4444',
  '#84cc16', '#8b5cf6'
];
