import { Module, CacheModule, CacheInterceptor, Type } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';

import { GitModule } from '@api/git';
import { ProjectsModule } from '@api/projects';
import { TeamsModule } from '@api/teams';
import { FilesModule } from '@api/files';
import { AuthModule } from '@api/auth';
import { ChatModule } from '@api/chat';

const API_ROUTE_MODULES: Type<any>[] = [
  AuthModule,
  GitModule,
  ProjectsModule,
  TeamsModule,
  FilesModule,
  ChatModule
];

@Module({
  imports: [
    CacheModule.register(),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'client'),
    }),
    ...API_ROUTE_MODULES
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [],
})
export class AppModule { }
