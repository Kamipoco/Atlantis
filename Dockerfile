FROM node:14.17.0

WORKDIR /app

RUN apt-get -y update
RUN apt-get install -y apt-transport-https build-essential libgconf-2-4 python git libglib2.0-dev
RUN bash -c ' \
  wget https://packages.microsoft.com/config/ubuntu/21.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
  dpkg -i packages-microsoft-prod.deb && \
  rm packages-microsoft-prod.deb && \
  apt-get update; \
  apt-get install -y apt-transport-https && \
  apt-get update && \
  apt-get install -y dotnet-sdk-5.0'

COPY ./.sequelizerc ./.sequelizerc

COPY ./scripts ./scripts
RUN chmod 700 /app/scripts/start.sh

COPY ./tsconfig.json ./tsconfig.json

COPY ./package.json ./package.json
COPY ./src ./src

RUN yarn
RUN yarn build

EXPOSE $PORT
CMD ["bash", "/app/scripts/start.sh"]
