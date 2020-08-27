import { LogMongoRepository } from "../../../infra/log-repository/log-mongo-repository"
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { Controller } from "../../../protocols/controller";

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller,logMongoRepository)
}