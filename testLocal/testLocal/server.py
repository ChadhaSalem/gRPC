import grpc
from concurrent import futures
import helloworld_pb2
import helloworld_pb2_grpc

class Greeter(helloworld_pb2_grpc.GreeterServicer):
    def SayHello(self, request, context):
        greetings = {
            'en': "Hello  ",
            'fr': "Bonjour  ",
            'ar': " عسلامة"
        }
        greeting = greetings.get(request.language, "Hello")
        return helloworld_pb2.HelloReply(message=f"{greeting}, {request.name}!")

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    helloworld_pb2_grpc.add_GreeterServicer_to_server(Greeter(), server)
    #seveurlocal
    server.add_insecure_port('[::]:50051') 
    #serveurexterne
    #server.add_insecure_port('0.0.0.0:50051')
    server.start()
    print("Server started on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
