cd front-end
npm install && npm run build
cd ../back-end
mvn spring-boot:run -Dspring-boot.run.profiles=production
