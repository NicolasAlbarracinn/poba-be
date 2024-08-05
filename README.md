# install db
docker-compose up -d 
npx prisma generate
npm run prisma:dev:deploy

# instalation locally
npm install
npm start

# instalation docker

docker build -t poba-be .
docker run -d -p 3005:3005 --network poba-be_cuch-be poba-be