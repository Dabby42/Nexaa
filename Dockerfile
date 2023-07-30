# Use the predefined node base image for this module.
FROM node:18.13.0

# create the log directory
RUN mkdir -p /var/log/applications/hera-be

# Creating base "src" directory where the source repo will reside in our container.
# Code is copied from the host machine to this "src" folder in the container as a last step.
RUN mkdir /src
WORKDIR /src
COPY . /src

# Install node dependencies
RUN yarn

#add in pm2 to keep app running
RUN yarn global add pm2 typeorm @nestjs/cli

RUN yarn build


# Map a volume for the log files and add a volume to override the code
VOLUME ["/src", "/var/log/applications/hera-be"]

# Expose web service and nodejs debug port
EXPOSE  8000
EXPOSE  5858

CMD ["pm2-runtime", "pm2.json"]
