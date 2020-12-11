import { TeamProjectReference as TeamProject } from 'azure-devops-node-api/interfaces/CoreInterfaces';
import { ICoreApi } from 'azure-devops-node-api/CoreApi';

type TeamProjects = TeamProject[];

export { ICoreApi, TeamProject, TeamProjects };
