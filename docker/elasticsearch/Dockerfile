FROM elasticsearch:2.3.2

ADD elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

RUN /usr/share/elasticsearch/bin/plugin install royrusso/elasticsearch-HQ

WORKDIR /usr/share/elasticsearch
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["elasticsearch"]
