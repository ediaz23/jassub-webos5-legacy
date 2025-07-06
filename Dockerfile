FROM docker.io/emscripten/emsdk:3.1.40

RUN apt-get update && \
    apt-get install curl -y --no-install-recommends && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - &&\
    apt-get install -y --no-install-recommends \
        build-essential \
        cmake \
        git \
        ragel \
        patch \
        libtool \
        itstool \
        pkg-config \
        python3 \
        gettext \
        autopoint \
        automake \
        autoconf \
        m4 \
        gperf \
        licensecheck \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN git config --global --add safe.directory /code
WORKDIR /code
RUN sudo usermod -aG sudo emscripten
RUN echo 'emscripten:123456' | chpasswd
USER emscripten
CMD [ "bash" ]
