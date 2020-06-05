FROM node:7

WORKDIR /submission

COPY . /submission

ENTRYPOINT ["node", "/submission/main.js"]

CMD ["test", "/submission/sample_input.json", "/submission/sample_output.json"]


#CMD node /app/main.js /app/sample.json /app/output.json
