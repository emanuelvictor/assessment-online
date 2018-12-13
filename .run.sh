cd front-end
npm install && npm run build
cd ../back-end
mvn spring-boot:run -Drun.jvmArguments="-Xmx2048m -Xms2048m"  -Dspring-boot.run.profiles=production &
