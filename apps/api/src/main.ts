import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import { resolve } from 'path';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  console.log(resolve(__dirname,));

  app.setGlobalPrefix(globalPrefix);

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(compression());

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3333;

    const options = new DocumentBuilder()
      .setTitle('ShadowBox DevOps API')
      .setDescription('Azure DevOps API wrapper')
      .setVersion('1.0')
      .addTag('repositories')
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
