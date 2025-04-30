FROM httpd:2.4-bookworm

RUN rm -rf /usr/local/apache2/conf/extra/*

COPY ./conf/extra/*.conf /usr/local/apache2/conf/extra/
COPY index.html /usr/local/apache2/htdocs/index.html

RUN echo "Include conf/extra/*.conf" >> /usr/local/apache2/conf/httpd.conf
RUN chown www-data:www-data /usr/local/apache2/logs -R

USER www-data