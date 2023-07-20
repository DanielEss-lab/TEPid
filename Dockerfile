#Contains all imported Node and Python packages. Called in: ./docker_build.sh 
#Eventually, we need to set the specific version of each of these imports. Perhaps make a requirements.txt file.

FROM node:19-bullseye-slim
RUN apt-get update
RUN apt-get install python3.10 -y

RUN apt-get install python3-pip -y
RUN apt-get install libxrender1 libxtst6 libxi6 -y

COPY requirements.txt ./

RUN pip install -r requirements.txt

# RUN pip install rdkit
# RUN pip install mordred
# RUN pip install pandas
# RUN pip install scikit-learn==1.2.2
# RUN pip install lightgbm==3.3.5

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install


COPY . .

RUN chmod -R 777 /app/

EXPOSE 3000
CMD [ "node", "app.js" ]