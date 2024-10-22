const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');

// Load the proto file
const PROTO_PATH = './helloworld.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

// Connect to the server
const client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());

// Create a readline interface to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to send a greeting request (unary call)
function sayHello(name, language) {
  client.SayHello({ name: name, language: language }, (err, response) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Greeting:', response.message);
    }
    rl.close(); // Close the readline interface after receiving the response
  });
}

// Function to handle streaming greetings
function streamGreetings(name, language) {
  const call = client.StreamGreetings({ name: name, language: language });

  // Receive streaming messages
  call.on('data', (response) => {
    console.log('Streaming Greeting:', response.message);
  });

  // Handle potential errors
  call.on('error', (err) => {
    console.error('Streaming error:', err);
  });

  // Handle the end of the stream
  call.on('end', () => {
    console.log('Streaming ended.');
    rl.close(); // Close the readline interface after the stream ends
  });
}

// Function to ask the user for their name and language
function askUser() {
  rl.question('Enter your name: ', (name) => {
    rl.question('Choose your language (fr/en/ar): ', (language) => {
      // Validate the chosen language
      if (['fr', 'en', 'ar'].includes(language)) {
        rl.question('Do you want a streaming call (y/n)? ', (isStreaming) => {
          if (isStreaming.toLowerCase() === 'y') {
            // Start the streaming call
            streamGreetings(name, language);
          } else {
            // Start a normal (unary) call
            sayHello(name, language);
          }
        });
      } else {
        console.log("Invalid language. Please choose 'fr', 'en', or 'ar'.");
        rl.close(); // Close the readline interface if the language is invalid
      }
    });
  });
}

// Start the process
askUser();
