import grpc
from concurrent import futures
import time  # Importer la bibliothèque time pour obtenir l'heure actuelle
import helloworld_pb2
import helloworld_pb2_grpc
import time
class Greeter(helloworld_pb2_grpc.GreeterServicer):
    def SayHello(self, request, context):
        greetings = {
            'en': "Hello",
            'fr': "Bonjour",
            'ar': "عسلااامة"
        }
        greeting = greetings.get(request.language, "Hello")
        return helloworld_pb2.HelloReply(message=f"{greeting} {request.name}!")

    def StreamGreetings(self, request, context):
        greetings = {
            'en': "Hello",
            'fr': "Bonjour",
            'ar': "عسلاامة"
        }
        greeting = greetings.get(request.language, "Hello")
        
        # Envoyer des messages en continu avec l'heure actuelle
        for i in range(5):  # 5 messages
            current_time = time.strftime("%H:%M:%S", time.localtime())
            yield helloworld_pb2.HelloReply(message=f"{greeting}, {request.name} à {current_time}")
            time.sleep(1)  # Attendre 1 seconde entre chaque message
    
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    helloworld_pb2_grpc.add_GreeterServicer_to_server(Greeter(), server)
    #server.add_insecure_port('[::]:50051')
    server.add_insecure_port('0.0.0.0:50051')
    server.start()
    print("Server started on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
