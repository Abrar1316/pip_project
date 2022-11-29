# pip_task_deployment app on kubernetes



This Demo is all about how to deploy a Full MERN Stack application
at a most famous and powerful containerized application
orchestration tool, Kubernetes.

In this Demo I will show the step for containerizing MERN
application, deploying them, and expose them to communicate with
each other and with the outer world.

In this demo I made two docker images, one for front-end and another
for backend application and I also used an official image of MongoDB
for making MongoDB Database instance as standalone microservice at
Kubernetes cluster. I also used Persistent Volume and Persistent
Volume Claim resources, a life-saving feature provided by
Kubernetes to make the database persistent at the cluster level so that
we do not lose our data even if our MongoDB Pod/Container gets
destroyed or restarted.

During the front-end containerization process, I first made a build for
our front-end React-based application and then used that build with
the Nginx web server for better performance and maintaining our
image lightweight in terms of size. I then deployed it and to make it
scalable I made 3 replicas of it and with LoadBalance type service
resource I exposed it to the outer world.

The backend server is build using Express and Node JS framework. I
deployed my backend app after containerizing it with 3 replicas to
make it scalable. I also exposed it with a LoadBalancer type
Kubernetes service resource so that proper load management can be
carried out by Kubernetes automatically.
Prerequisites-

● Install Docker in your local machine.
● Install Minikube in your Local Machine
● Install Kubectl in your local machine

Step for deploy a Full MERN Stack application using Minikube on
Kubernetes.
1. Go to your project Directory.

2. Open the terminal in the root directory of your project.

3. Start the minikube with attach driver docker using command
# minikube start –driver=docker

4. Now move to the backend directory the create the backend
service yaml file using this command.
# kubectl create -f server-app-service.yaml

5. Now list the services resource using this command.
# kubectl get service

6. In Minikube setup, we will be using Minikube IP and this below
backend service port number

which is 30792 in my case.
7. To get minikube ip use below command.
# minikube ip

8. Now move to default.conf file of nginx in client directory and
then paste this minikube ip:30792 in place on proxy_pass
http://minikubeip:backend_service_port. So that frontend
service will communicate with our backend service using this ip
and port number.

10. Now build your client image using command:
# docker image build -t todo-client-kubernetes-app .

11.Once image build is done, you can reconfirm the successful
image creation using the command:
# docker image ls

12. now we will move to the next step and create front-end app’s
Kubernetes resources that include a LoadBalancer type service
resource and a deployment resource with 3 replicas.

13. Open the client-app-deploy.yaml file.this YAML file contains basic
instructions for Kubernetes to create a deployment resource and
assign todo-client-app-deploy as its name, make 3 pods as
replicas and match label app: todo-client-app set in the selector
to keep track the group of resources. After selector instruction then
comes the pod template which will be used as configuration to create
any Pod by the replicaSet that Kubernetes create underneath
deployment resource. These pods will be group with a label app:
todo-client-app and the image to use is todo-client-kubernetes-
app:latest and last instruction tell to look the image first locally and
if not found then only look at docker hub for download. I choose this
image pull policy for this example to avoid pushing and then
downloading our front-end and backend app images.


But As I am using Minikube, it by defaults runs inside a virtual
machine VM and the docker we used to build our image runs on our
local system i.e. outside Minikube VM. This is why our newly created
image that docker created in our local machine will not be accessible
from Minikube VM and this will lead to ImagePullError for the Pods
that will be created by using above YAML file by deployment resource.


To solve this issue save a copy of this image from our local system’s file
system to Minikube’s VM environment using this command-
# docker save todo-client-kubernetes-app | (eval$(minikube docker-env) &amp;&amp; docker load)

14. finally create a deployment resource, run the following command:
# kubectl create -f client-app-deploy.yaml
To list the newly created deployment, replicaSet, and Pod resource,
type the following:

# kubectl get deploy,rs,pod

15. Now we will be creating a load balancer type service resource so
that we could expose our front-end application to the outer world.
# kubectl create -f client-app-service.yaml

16. List the services using kubectl get service

17. NowGo to browser use the frontend service port and minikube ip to
access the frontend
# http://minikubeip:frontend_servcie_port_number

This is all for the front-end application deployment now we will switch
our directory from client to backend for backend application
deployment.

Now before I create my backend application resources, I must up
MongoDB so that when my backend application gets created and look
for MongoDB database at any stage, it finds it.

To create MongoDB I will be creating persistent volume and persistent
volume claim so my MongoDB instance can use these cluster level
storage to save our database files. This is important as we do not ever
want to lose the data in the case of pod/container recreation.

Go to backend directory and create the persistent volume.

18. Now look into the persistent-vol-server-app.yaml file.I am creating
a persistent volume resource with an access mode of ReadWriteMany
which by definition says read and write can be done by more than one
node. Capacity is set to 1gb and hostPath is set to /tmp/todo-pv which
can be set to any other directory if needed.

To create persistent volume resource. run this command.

# kubectl create -f persistent-vol-server-app.yaml

19. Now look into the persistent-vol-claim-server-app.yaml. I create a
persistent volume claim resource that will look for a persistent volume
with an access mode of ReadWriteMany (which matches our recently
created PV), Requesting storage capacity of 1gb and as we did not add
any storage class in our persistent volume when created so to match
we will here use storageClassName to “” which says find a PV with no
storage class.

To create persistent volume claim resource. Run this command
# kubectl create -f persistent-vol-claim-server-app.yaml

20. Now it’s time to create a pod resource for our MongoDB as stand-
alone container instance and for doing that I will be using mongodb-
pod.yaml file:

mongodb-pod.yaml file will create a pod with the name of
monogodb-pod. The label is set to app: todo-mongodb which
will be needed when I will create a service for this pod. Volume with
todo-pvc persistent volume claim is created so that it can be mount
by Mongodb container and the purpose of this is just to make the
database file persistent at the cluster level. The container uses the
mongo image which is an official image of MongoDB at docker hub.
Command mongod — bind 0.0.0.0 is to start MongoDB server inside
the container with binding it with any incoming IP as mongoDB by
default only binds to localhost i.e. 127.0.0.1 but I will be calling it from
service resource or minikube IP.

To create MongoDB pod. Run this command
# kubectl create -f mongodb-pod.yaml

21. Now I will be creating a service for above mongodb pod so that
other resource could reach to our MongoDB instance

To create service resource for MongoDB Pod from the mongodb-
service.yaml file: Run this command-
# kubectl create -f mongodb-service.yaml

The mongodb-service.yaml file will create ClusterIP type service
for our MongoDB Pod. Why I choose ClusterIP type and not any
other type of service is because this instance will be called only within
the cluster and we do not want someone to access it from the outer
world.

22. Now run the backend docker file.using this command-
# docker image build -t todo-server-kubernetes-app .

23. Now again copy this image inside Minikube VM as I did for front-
end app image so that when I create deployment resource it finds it
from there, I will use the following command:

# docker save todo-server-kubernetes-app | (eval
$(minikube docker-env) &amp;&amp; docker load).

Now I will deploy my backend server with the help of few YAML files
like I did above for the client-side app.

24. Now open the server-app-configs.yaml file and replace
&lt;front-end-app-service-ip&gt;:&lt;port&gt; with the external-
IP/Minikube and the port number from a service resource of the front-
end app. In my case, I will be replacing it with
http://192.168.49.2:31909.

25. Now create the configMap resource:using this command
# kubectl create -f server-app-configs.yaml

I have created this configMap resource to hold my variable values as
key/value pair which we need to use it in the backend application
container as an environmental variable. In this fil, three key/value pair
the first is PORT which will make our application listen to port 5000.
The second key is the CLIENT which holds the front-end application
IP and Port number which we also used to access it from the browser
and which in our case is the minikube IP and client app service port
number. This is required as our backend application will only
entertain incoming API requests from the path we will define here.
This is because of Cross-origin resource sharing (CORS) restriction in
our backend app, so logically we did it correctly by providing a
complete URL of our front-end application. The third key is
MONGODB_URL which holds a fully qualified domain name
(FQDN) of our MongoDB service resource. This way when our
backend application will make a call to MongoDB, Kubernetes internal
DNS server will divert that request to the MongoDB pod which is
behind the clusterIP type service we created for MongoDB instance.

26. Now at last create the backend deployment resource from the
server-app-deploy.yaml. Using this command:
# kubectl create -f server-app-deploy.yaml

I have successfully deployed a complete MERN application on a
Kubernetes cluster which is also scalable as we created 3 replicas for
front-end and the backend application.
