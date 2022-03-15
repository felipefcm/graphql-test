
import * as sst from "@serverless-stack/resources";
import { GraphQLApi } from "@serverless-stack/resources";

export default class APIStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    new GraphQLApi(this, 'graphql-api', {
      server: 'src/server.handler'
    })
  }
}
