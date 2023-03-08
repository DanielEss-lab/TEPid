FROM node:19-bullseye-slim
RUN apt-get update
RUN apt-get install python3 -y

RUN apt-get install python3-pip -y
RUN apt-get install libxrender1 libxtst6 libxi6 -y
RUN pip install rdkit
RUN pip install mordred
RUN pip install pandas
RUN pip install scikit-learn
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install


COPY . .

RUN chmod -R 777 /app/

EXPOSE 3000
CMD [ "node", "app.js" ]