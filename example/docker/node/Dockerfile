FROM node:16

# bash aliases

COPY .aliasesrc /root/.aliasesrc
RUN echo "\nsource /root/.aliasesrc" >> /root/.bashrc;

# entrypoint

COPY ./entrypoint.sh /entrypoint.sh

CMD ["npm", "run", "serve"]

ENTRYPOINT ["/entrypoint.sh"]
