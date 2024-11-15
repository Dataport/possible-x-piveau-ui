FROM node:18
WORKDIR /app
COPY . .
RUN npm ci --prefix apps/vanilla-piveau-hub-ui
RUN cp apps/vanilla-piveau-hub-ui/config/user-config.sample.js apps/vanilla-piveau-hub-ui/config/user-config.js
RUN npm run build --prefix apps/vanilla-piveau-hub-ui
RUN npm i
RUN ln -s ../apps/vanilla-piveau-hub-ui/node_modules/@piveau node_modules/@piveau
RUN npm run build
CMD npm run dev