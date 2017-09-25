FROM python:3.6

ADD chute /opt/chute
WORKDIR /opt/chute

RUN pip install .

EXPOSE 80
CMD ["airshark"]
