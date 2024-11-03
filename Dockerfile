ARG NODE_VERSION=20.18.0

WORKDIR /app

COPY package*.json install.html .babelrc webpack.config.js .npmrc ./
RUN npm install

# Express
COPY server ./server

# React

COPY react ./react
RUN npm run build

# Clean up
RUN rm -rf react .babelrc webpack.config.js package*.json

# Starting Server
EXPOSE 8080
ENV PORT=8080
CMD ['node', 'server/server.js']
