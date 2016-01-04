FROM sunnybhanot/ubuntu

ENV AEROSPIKE_AMC_VERSION 3.6.5

# Add run script

Add ./run.sh /run.sh

# Install
RUN apt-get update -y \
 && apt-get install -y build-essential python-dev python-pip wget logrotate ca-certificates \
 && pip install markupsafe \
 && pip install paramiko \
 && pip install ecdsa \
 && pip install pycrypto \
 && wget http://www.aerospike.com/artifacts/aerospike-amc-community/${AEROSPIKE_AMC_VERSION}/aerospike-amc-community-${AEROSPIKE_AMC_VERSION}.all.x86_64.deb -O /tmp/aerospike-amc-community-${AEROSPIKE_AMC_VERSION}.all.x86_64.deb \
 && dpkg -i "/tmp/aerospike-amc-community-${AEROSPIKE_AMC_VERSION}.all.x86_64.deb" \
 && chmod a+x /run.sh \
 && apt-get purge -y --auto-remove wget ca-certificates

# Export Ports
EXPOSE 8081

# Default Command
CMD /run.sh
