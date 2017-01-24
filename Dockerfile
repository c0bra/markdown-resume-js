FROM mkenney/npm

WORKDIR /src
COPY . /src

# extracted from https://github.com/LoicMahieu/alpine-wkhtmltopdf/blob/master/Dockerfile
RUN apk add --no-cache \
      xvfb \
      # Additionnal dependencies for better rendering
      ttf-freefont \
        fontconfig \
        dbus \
        && \

      # Install wkhtmltopdf from `testing` repository
      apk add qt5-qtbase-dev \
        wkhtmltopdf \
        --no-cache \
        --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ \
        --allow-untrusted \
        && \

      # Wrapper for xvfb
      mv /usr/bin/wkhtmltopdf /usr/bin/wkhtmltopdf-origin && \
        echo $'#!/usr/bin/env sh\n\
        Xvfb :0 -screen 0 1024x768x24 -ac +extension GLX +render -noreset & \n\
        DISPLAY=:0.0 wkhtmltopdf-origin $@ \n\
        killall Xvfb\
        ' > /usr/bin/wkhtmltopdf && \
        chmod +x /usr/bin/wkhtmltopdf

RUN npm install -g markdown-resume && rm -rf /src/*

ENTRYPOINT ["md2resume"]
CMD -h
