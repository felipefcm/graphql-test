
import APIStack from "./APIStack"
import * as sst from "@serverless-stack/resources"

export default function main(app: sst.App): void {

  app.setDefaultFunctionProps({
    runtime: "nodejs14.x"
  })

  new APIStack(app, "api-stack")
}
