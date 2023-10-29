import Owner from "../domain/Owner";
import {LoggingService} from "./LoggingService";
import {Logging} from "../utils/Logging";

export class OwnerService {

    public static async retrieveOwner(owner: string): Promise<Owner | null> {
        try {
            LoggingService.logWithOwner(Logging.OWNER_RETRIEVING, owner);

            return await Owner.findByPk(owner);
        } catch (error) {
            LoggingService.logWithOwner(Logging.OWNER_RETRIEVAL_FAILED, owner);
            throw new Error();
        }
    }

    public static async doesOwnerExists(username: string) {
        const owner: Owner = await this.retrieveOwner(username);
        return owner != undefined;
    }

    public static async saveOwner(owner: string): Promise<Owner> {
        try {
            LoggingService.logWithOwner(Logging.OWNER_SAVING, owner);

            return await Owner.create({
                username: owner
            });
        } catch (err) {
            LoggingService.logWithOwner(Logging.OWNER_SAVED_FAILED, owner);
            throw new Error();
        }
    }
}