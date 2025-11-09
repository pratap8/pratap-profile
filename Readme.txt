//Insert into GIT
git add .
git commit -m "<Any relatable comment>"
git push origin main

//Deploy in static page github.into
npm run deploy

//Vercel command
npm run build

//run below sttaic page
https://pratap8.github.io/pratap-portfolio/


Whenever some edit is done in the project use below command

//for builing and sending to docker
docker build -t pratap-portfolio .

//To run the docker
docker run -d -p 3000:80 pratap-portfolio


//Normal start in terminal command:
npm start

//deploy in vercel directly
vercel --prod


Note: You can direct run inside docker

URL:
http://localhost:3000/#projects