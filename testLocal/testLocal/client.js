const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');

// Charger le fichier proto
const PROTO_PATH = './helloworld.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

// Connexion au serveur
const client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
//const client = new hello_proto.Greeter('localhost':50051', grpc.credentials.createInsecure());

// Créer une interface readline pour obtenir des entrées utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour envoyer la requête de salutation
function sayHello(name, language) {
  client.SayHello({ name: name, language: language }, (err, response) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Greeting:', response.message);
    }
    rl.close(); // Fermer l'interface readline après avoir obtenu la réponse
  });
}

// Fonction pour demander à l'utilisateur son nom et sa langue
function askUser() {
  rl.question('Entrez votre nom: ', (name) => {
    rl.question('Choisissez votre langue (fr/en/ar): ', (language) => {
      // Vérifier si la langue choisie est valide
      if (['fr', 'en', 'ar'].includes(language)) {
        sayHello(name, language);
      } else {
        console.log("Langue non valide. Veuillez choisir entre 'fr', 'en', ou 'ar'.");
        rl.close(); // Fermer l'interface readline si la langue n'est pas valide
      }
    });
  });
}

// Démarrer le processus
askUser();
